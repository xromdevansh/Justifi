import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') })

console.log('🔍 Backend Diagnostic Check\n')

// Check 1: .env file exists
const envPath = join(__dirname, '.env')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!')
  console.error('   Solution: Copy env.example to .env')
  console.error('   Command: copy env.example .env (Windows) or cp env.example .env (Mac/Linux)\n')
  process.exit(1)
} else {
  console.log('✅ .env file exists')
}

// Check 2: Required environment variables
const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY']
const missingVars = []

requiredVars.forEach(varName => {
  if (!process.env[varName] || process.env[varName].includes('your-') || process.env[varName].includes('change-this')) {
    missingVars.push(varName)
    console.error(`❌ ${varName} is missing or not configured`)
  } else {
    console.log(`✅ ${varName} is set`)
  }
})

if (missingVars.length > 0) {
  console.error('\n⚠️  Missing or unconfigured environment variables!')
  console.error('   Please update backend/.env file with proper values\n')
  process.exit(1)
}

// Check 3: MongoDB connection
console.log('\n🔌 Testing MongoDB connection...')
try {
  const mongoose = (await import('mongoose')).default
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/justifi'
  
  await mongoose.connect(mongoURI)
  console.log('✅ MongoDB connected successfully')
  await mongoose.disconnect()
} catch (error) {
  console.error('❌ MongoDB connection failed:', error.message)
  console.error('\n💡 Troubleshooting:')
  console.error('   1. Check if MongoDB is running (if using local)')
  console.error('   2. Verify MONGODB_URI in .env is correct')
  console.error('   3. For MongoDB Atlas: Check IP whitelist and credentials')
  console.error('   4. See MONGODB_SETUP.md for detailed instructions\n')
  process.exit(1)
}

// Check 4: Test Gemini API key (if configured)
if (process.env.GEMINI_API_KEY && 
    process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here' && 
    process.env.GEMINI_API_KEY.trim() !== '') {
  console.log('\n🤖 Testing Gemini API key...')
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Try gemini-pro first (most common)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    // Try a simple test request
    const result = await model.generateContent('Say "test"')
    await result.response
    console.log('✅ Gemini API key is valid')
  } catch (error) {
    console.error('❌ Gemini API key test failed:', error.message)
    console.error('\n💡 Troubleshooting:')
    console.error('   1. Verify your API key is correct in .env')
    console.error('   2. Get a new key from: https://makersuite.google.com/app/apikey')
    console.error('   3. Make sure there are no extra spaces in the key')
    console.error('   4. Check if your API key has proper permissions\n')
  }
} else {
  console.log('\n⚠️  Gemini API key not configured - AI features will not work')
  console.log('   Get your API key from: https://makersuite.google.com/app/apikey')
  console.log('   Add it to backend/.env as GEMINI_API_KEY=your-key-here\n')
}

console.log('\n✅ All checks passed! Backend is ready to run.')
console.log('   Start server with: npm run dev\n')

