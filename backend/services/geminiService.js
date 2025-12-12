import { GoogleGenerativeAI } from '@google/generative-ai'
import { sanitizeInput } from '../utils/security.js'

// Function to get Gemini AI instance (lazy initialization)
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.trim() === '') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env file. Get your key from https://aistudio.google.com/app/apikey')
  }
  return new GoogleGenerativeAI(apiKey)
}

// Cache for available models (to avoid querying on every request)
let availableModelsCache = null
let modelsCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Function to get available models from the API
const getAvailableModels = async (genAI) => {
  try {
    // Use cached models if available and fresh
    const now = Date.now()
    if (availableModelsCache && (now - modelsCacheTime) < CACHE_DURATION) {
      return availableModelsCache
    }

    // Fetch available models from API (using global fetch available in Node 18+)
    const apiKey = process.env.GEMINI_API_KEY
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`)
    }
    
    const data = await response.json()
    const models = data.models
      ?.filter(model => 
        model.supportedGenerationMethods?.includes('generateContent') || 
        model.supportedGenerationMethods?.includes('generateContentStream')
      )
      ?.map(model => model.name.replace('models/', ''))
      ?.filter(Boolean) || []
    
    // Cache the results
    availableModelsCache = models
    modelsCacheTime = now
    
    if (process.env.NODE_ENV === 'development' && models.length > 0) {
      console.log(`📋 Available Gemini models: ${models.join(', ')}`)
    }
    
    return models.length > 0 ? models : null
  } catch (error) {
    // If fetching fails, return null to use fallback list
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Could not fetch available models, using fallback list:', error.message)
    }
    return null
  }
}

// System prompts for each tool
const SYSTEM_PROMPTS = {
  'ask': `You are a legal AI assistant providing precise, well-researched legal insights. 
Respond with clear, structured answers backed by legal reasoning. Always include relevant 
context and note when information should be verified by a qualified attorney.`,

  'express-draft': `You are an expert legal document drafter. Generate professional legal 
documents including contracts, agreements, letters, and other legal instruments. Ensure:
1. Clear structure with proper headings
2. Comprehensive legal language
3. Standard clauses where applicable
4. Professional formatting
5. Compliance with general legal principles
Always include a disclaimer that the document should be reviewed by legal counsel.`,

  'clause-check': `You are a legal clause analysis expert. Analyze legal clauses and documents 
with precision. For each clause, provide:
1. Clear interpretation
2. Potential issues or ambiguities
3. Risk assessment
4. Recommendations for improvement
5. Relevant legal context
Format your response clearly with sections and bullet points.`,

  'case-miner': `You are a legal research specialist focused on case law and precedents. 
When provided with a legal issue, provide:
1. Relevant case summaries
2. Key legal principles established
3. Precedent value and applicability
4. Citation information
5. Comparative analysis where relevant
Structure your response as a research brief with clear sections.`,

  'legal-mind': `You are an advanced legal reasoning AI. Provide deep, analytical legal 
insights including:
1. Complex legal reasoning
2. Multi-faceted analysis
3. Consideration of different perspectives
4. Strategic recommendations
5. Risk-benefit analysis
6. Ethical considerations where applicable
Present your analysis in a structured, comprehensive format.`
}

export const generateResponse = async (tool, userQuery, fileContent = null) => {
  try {
    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.trim() === '') {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in backend/.env file. Get your key from https://aistudio.google.com/app/apikey')
    }
    
    // Sanitize input
    const sanitizedQuery = sanitizeInput(userQuery)
    
    if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
      throw new Error('Query cannot be empty')
    }

    // Get system prompt for the tool
    const systemPrompt = SYSTEM_PROMPTS[tool] || SYSTEM_PROMPTS['ask']
    
    // Construct the full prompt - include file context if provided
    let fullPrompt = `${systemPrompt}\n\nUser Query: ${sanitizedQuery}`
    
    if (fileContent && fileContent.text) {
      // Add file context to the prompt
      const fileContext = `\n\n[Document Content from uploaded file: ${fileContent.metadata?.originalName || 'document'}]\n${fileContent.text}\n\nPlease analyze the above document content in relation to the user's query.`
      fullPrompt += fileContext
    }
    
    fullPrompt += `\n\nPlease provide a comprehensive, well-formatted response.`

    // Get the model (create new instance to ensure API key is loaded)
    const genAI = getGenAI()
    
    // Try to get available models from API, fallback to known working models
    let modelsToTry = await getAvailableModels(genAI)
    
    // If we couldn't fetch available models, use a curated list
    if (!modelsToTry || modelsToTry.length === 0) {
      modelsToTry = [
        'gemini-1.5-flash',        // Newest, fastest, free tier (most common)
        'gemini-1.5-flash-latest', // Latest version of flash
        'gemini-1.5-pro',           // More capable model
        'gemini-1.5-pro-latest',   // Latest version of pro
        'gemini-pro'                // Legacy (may not be available in all regions)
      ]
    } else {
      // Sort available models by preference (flash first, then pro, then others)
      modelsToTry.sort((a, b) => {
        const priority = { 'flash': 1, 'pro': 2 }
        const aPriority = Object.keys(priority).find(key => a.includes(key)) ? priority[Object.keys(priority).find(key => a.includes(key))] : 3
        const bPriority = Object.keys(priority).find(key => b.includes(key)) ? priority[Object.keys(priority).find(key => b.includes(key))] : 3
        return aPriority - bPriority
      })
    }
    
    let lastError = null
    let lastErrorDetails = null
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        
        // Try simple generateContent first (most compatible)
        try {
          const result = await model.generateContent(fullPrompt)
          const response = await result.response
          const text = response.text()
          
          // Success! Log which model worked for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ Using Gemini model: ${modelName} (generateContent)`)
          }
          
          return text
        } catch (generateError) {
          // If generateContent fails, try chat format
          try {
            const chat = model.startChat({
              history: [
                {
                  role: 'user',
                  parts: [{ text: systemPrompt }]
                },
                {
                  role: 'model',
                  parts: [{ text: 'I understand. I will act as a legal AI assistant.' }]
                }
              ]
            })
            
            const result = await chat.sendMessage(sanitizedQuery)
            const response = await result.response
            const text = response.text()
            
            // Success! Log which model worked for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log(`✅ Using Gemini model: ${modelName} (chat)`)
            }
            
            return text
          } catch (chatError) {
            // Both methods failed for this model, throw the first error
            throw generateError
          }
        }
      } catch (error) {
        lastError = error
        lastErrorDetails = {
          message: error.message,
          status: error.status || error.statusCode,
          code: error.code,
          model: modelName
        }
        
        // Log error details in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`❌ Model ${modelName} failed:`, error.message.substring(0, 200))
        }
        
        // For 404 (model not found), always try next model
        if (error.message && (error.message.includes('404') || error.message.includes('not found') || error.message.includes('is not found'))) {
          continue
        }
        
        // For 403 (permission denied), try next model (might be region-specific)
        if (error.message && error.message.includes('403')) {
          continue
        }
        
        // For 400 (bad request) or invalid model errors, try next model
        if (error.message && (error.message.includes('400') || error.message.includes('invalid') || error.message.includes('not supported'))) {
          continue
        }
        
        // For other errors, still try next model (might be temporary issues)
        // Only stop if it's a clear authentication/authorization error
        if (error.message && (error.message.includes('401') || error.message.includes('unauthorized'))) {
          throw error // Don't continue if auth fails
        }
        
        // Continue to next model for other errors
        continue
      }
    }
    
    // If all models failed, provide detailed error message
    const errorMsg = lastErrorDetails 
      ? `Gemini API error with model ${lastErrorDetails.model}: ${lastErrorDetails.message || lastError?.message}`
      : lastError?.message || 'Unknown error'
    
    throw new Error(
      `Gemini API failed: ${errorMsg}. ` +
      `Please verify: 1) Your API key is valid and from https://aistudio.google.com/app/apikey, ` +
      `2) The Generative Language API is enabled in Google Cloud Console, ` +
      `3) Your API key has proper permissions. Error details: ${JSON.stringify(lastErrorDetails)}`
    )
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error(`AI generation failed: ${error.message}`)
  }
}


