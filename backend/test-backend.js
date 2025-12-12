// Simple backend test script
console.log('🔍 Testing Backend Configuration...\n')

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Check if .env exists
const envPath = join(__dirname, '.env')
const envExists = existsSync(envPath)

console.log(`1. .env file: ${envExists ? '✅ EXISTS' : '❌ NOT FOUND'}`)

if (!envExists) {
  console.log('\n❌ PROBLEM FOUND: .env file is missing!')
  console.log('\n📝 SOLUTION:')
  console.log('   1. Copy backend/env.example to backend/.env')
  console.log('   2. Edit backend/.env and add your MongoDB URI and Gemini API key')
  console.log('   3. See FIX_BACKEND.md for detailed instructions')
  process.exit(1)
}

// Load environment variables
dotenv.config({ path: envPath })

// Check required variables
const checks = [
  { name: 'MongoDB URI', value: process.env.MONGODB_URI },
  { name: 'Gemini API Key', value: process.env.GEMINI_API_KEY },
  { name: 'JWT Secret', value: process.env.JWT_SECRET }
]

console.log('\n2. Environment Variables:')
let allGood = true
checks.forEach(check => {
  const isSet = check.value && check.value !== 'your-gemini-api-key-here' && check.value !== 'your-super-secret-jwt-key-change-this-in-production-min-32-chars'
  console.log(`   ${check.name}: ${isSet ? '✅ SET' : '❌ NOT SET or using default'}`)
  if (!isSet) allGood = false
})

if (!allGood) {
  console.log('\n❌ Some environment variables are missing!')
  console.log('   Please edit backend/.env and fill in all required values')
  process.exit(1)
}

console.log('\n✅ All configuration checks passed!')
console.log('\n🚀 You can now start the backend with: npm run dev')


