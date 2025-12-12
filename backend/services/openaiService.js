import OpenAI from 'openai'
import { sanitizeInput } from '../utils/security.js'

// Initialize OpenAI client
const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your-openai-api-key-here' || apiKey.trim() === '') {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in backend/.env file. Get your key from https://platform.openai.com/api-keys')
  }
  return new OpenAI({ apiKey })
}

// System prompts for each tool (same as Gemini)
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

export const generateResponse = async (tool, userQuery) => {
  try {
    // Check if API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey || apiKey === 'your-openai-api-key-here' || apiKey.trim() === '') {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in backend/.env file. Get your key from https://platform.openai.com/api-keys')
    }
    
    // Sanitize input
    const sanitizedQuery = sanitizeInput(userQuery)
    
    if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
      throw new Error('Query cannot be empty')
    }

    // Get system prompt for the tool
    const systemPrompt = SYSTEM_PROMPTS[tool] || SYSTEM_PROMPTS['ask']
    
    // Initialize OpenAI client
    const openai = getOpenAI()
    
    // Use GPT-4 or GPT-3.5-turbo (GPT-3.5 is cheaper and faster)
    const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
    
    // Generate response
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: sanitizedQuery }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
    
    const text = completion.choices[0].message.content
    
    if (!text) {
      throw new Error('No response generated from OpenAI')
    }
    
    return text
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Provide helpful error messages
    if (error.status === 401) {
      throw new Error('OpenAI API key is invalid. Please check your OPENAI_API_KEY in backend/.env')
    } else if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again in a moment.')
    } else if (error.status === 500) {
      throw new Error('OpenAI API server error. Please try again later.')
    }
    
    throw new Error(`AI generation failed: ${error.message}`)
  }
}

