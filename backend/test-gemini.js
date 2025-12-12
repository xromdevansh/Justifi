// Quick test script to find the correct Gemini model name
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in .env')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

// Try different model names
const modelsToTry = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro', 'models/gemini-pro']

console.log('🔍 Testing different Gemini model names...\n')

for (const modelName of modelsToTry) {
  try {
    console.log(`Testing: ${modelName}...`)
    const model = genAI.getGenerativeModel({ model: modelName })
    const result = await model.generateContent('Say "test"')
    const response = await result.response
    const text = response.text()
    console.log(`✅ SUCCESS! Model "${modelName}" works!`)
    console.log(`   Response: ${text.substring(0, 50)}...\n`)
    process.exit(0)
  } catch (error) {
    console.log(`❌ Failed: ${error.message.split('\n')[0]}\n`)
  }
}

console.log('❌ None of the tested model names worked.')
console.log('💡 Your API key might need the Generative AI API enabled in Google Cloud Console.')
console.log('   Visit: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com')

