// Unified AI Service - Supports multiple providers
// Priority: Gemini > Groq (FREE) > OpenAI

import { generateResponse as generateGroqResponse } from './groqService.js'
import { generateResponse as generateOpenAIResponse } from './openaiService.js'
import { generateResponse as generateGeminiResponse } from './geminiService.js'

/**
 * Get the configured AI provider
 * Priority: Gemini > Groq (FREE) > OpenAI
 */
const getAIProvider = () => {
  const groqKey = process.env.GROQ_API_KEY
  const openaiKey = process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  
  // Check if Gemini is configured (primary provider)
  if (geminiKey && 
      geminiKey !== 'your-gemini-api-key-here' && 
      geminiKey.trim() !== '') {
    return 'gemini'
  }
  
  // Check if Groq is configured (FREE!)
  if (groqKey && 
      groqKey !== 'your-groq-api-key-here' && 
      groqKey.trim() !== '') {
    return 'groq'
  }
  
  // Check if OpenAI is configured
  if (openaiKey && 
      openaiKey !== 'your-openai-api-key-here' && 
      openaiKey.trim() !== '') {
    return 'openai'
  }
  
  // Default to Gemini (requires API key)
  return 'gemini'
}

/**
 * Generate AI response using the configured provider
 * @param {string} tool - The tool/feature being used
 * @param {string} userQuery - The user's query text
 * @param {object} fileContent - Optional file content object with text and metadata
 */
export const generateResponse = async (tool, userQuery, fileContent = null) => {
  const provider = getAIProvider()
  
  // Check if provider is configured
  if (!provider) {
    throw new Error(
      'No AI provider configured. Please set GEMINI_API_KEY in backend/.env file. ' +
      'Get your free key from https://aistudio.google.com/app/apikey. ' +
      'Alternative free options: Groq (free key)'
    )
  }
  
  try {
    if (provider === 'gemini') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🤖 Using Gemini API' + (fileContent ? ' (with file)' : ''))
      }
      return await generateGeminiResponse(tool, userQuery, fileContent)
    } else if (provider === 'groq') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🤖 Using Groq API (FREE!)' + (fileContent ? ' (with file)' : ''))
      }
      return await generateGroqResponse(tool, userQuery, fileContent)
    } else if (provider === 'openai') {
      if (process.env.NODE_ENV === 'development') {
        console.log('🤖 Using OpenAI API' + (fileContent ? ' (with file)' : ''))
      }
      return await generateOpenAIResponse(tool, userQuery, fileContent)
    }
  } catch (error) {
    // Try fallbacks if primary provider fails
    const fallbacks = []
    if (provider !== 'gemini' && process.env.GEMINI_API_KEY) fallbacks.push({ name: 'Gemini', fn: generateGeminiResponse })
    if (provider !== 'groq' && process.env.GROQ_API_KEY) fallbacks.push({ name: 'Groq', fn: generateGroqResponse })
    if (provider !== 'openai' && process.env.OPENAI_API_KEY) fallbacks.push({ name: 'OpenAI', fn: generateOpenAIResponse })
    
    for (const fallback of fallbacks) {
      try {
        console.warn(`⚠️ ${provider} failed, trying ${fallback.name} as fallback...`)
        return await fallback.fn(tool, userQuery, fileContent)
      } catch (fallbackError) {
        continue
      }
    }
    
    throw error
  }
}

