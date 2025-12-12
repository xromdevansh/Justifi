// Quick setup checker script
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env') })

console.log('🔍 Checking Backend Setup...\n')

const checks = [
  {
    name: '.env file exists',
    check: () => {
      try {
        const fs = await import('fs')
        const exists = fs.existsSync(join(__dirname, '.env'))
        return exists
      } catch {
        return false
      }
    }
  },
  {
    name: 'MongoDB URI configured',
    check: () => !!process.env.MONGODB_URI
  },
  {
    name: 'Gemini API Key configured',
    check: () => !!process.env.GEMINI_API_KEY
  },
  {
    name: 'JWT Secret configured',
    check: () => !!process.env.JWT_SECRET
  },
  {
    name: 'Port configured',
    check: () => !!process.env.PORT || true // Has default
  }
]

let allPassed = true
for (const { name, check } of checks) {
  const result = await check()
  const status = result ? '✅' : '❌'
  console.log(`${status} ${name}`)
  if (!result) allPassed = false
}

console.log('\n' + (allPassed ? '✅ All checks passed!' : '❌ Some checks failed. Please configure your .env file.'))
console.log('\n💡 To fix: Copy backend/env.example to backend/.env and fill in your values')


