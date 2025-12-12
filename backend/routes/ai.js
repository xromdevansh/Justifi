import express from 'express'
import { body, validationResult } from 'express-validator'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { authenticate } from '../middleware/auth.js'
import { generateResponse } from '../services/aiService.js'
import { extractFileContent, validateFile } from '../utils/fileProcessor.js'
import QueryLog from '../models/QueryLog.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Ensure temp directory exists
const tempDir = path.join(__dirname, '../temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files temporarily in a temp directory
    cb(null, tempDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

// Helper function to handle AI requests with optional file upload
const handleAIRequest = async (req, res, tool, fileContent = null) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid input', details: errors.array() })
    }

    const { query } = req.body

    // Query is required unless we have file content
    if ((!query || query.trim().length === 0) && !fileContent) {
      return res.status(400).json({ error: 'Query is required or upload a file' })
    }

    // Combine query and file content if file was uploaded
    let fullQuery = query || ''
    if (fileContent) {
      const fileInfo = `\n\n[Uploaded File Content]\nFile: ${fileContent.metadata?.originalName || 'document'}\nPages: ${fileContent.pageCount || 1}\n\n${fileContent.text}`
      fullQuery = fullQuery ? `${fullQuery}${fileInfo}` : fileContent.text
    }

    // Generate AI response
    const response = await generateResponse(tool, fullQuery, fileContent)

    // Log the query
    try {
      await QueryLog.create({
        userId: req.user._id,
        tool,
        query: fullQuery.substring(0, 5000), // Limit stored query length
        response: response.substring(0, 10000) // Limit stored response length
      })
    } catch (logError) {
      console.error('Failed to log query:', logError)
      // Don't fail the request if logging fails
    }

    res.json({
      success: true,
      response,
      tool,
      fileProcessed: !!fileContent
    })
  } catch (error) {
    console.error(`Error in ${tool}:`, error)
    res.status(500).json({ 
      error: error.message || 'AI processing failed. Please try again.' 
    })
  }
}

// All AI routes require authentication
router.use(authenticate)

// Generic ask endpoint
router.post('/ask', [
  body('query').trim().notEmpty().isLength({ min: 1, max: 10000 })
], async (req, res) => {
  await handleAIRequest(req, res, 'ask')
})

// Express Draft endpoint
router.post('/express-draft', [
  body('query').trim().notEmpty().isLength({ min: 1, max: 10000 })
], async (req, res) => {
  await handleAIRequest(req, res, 'express-draft')
})

// Clause Check endpoint (with file upload support)
router.post('/clause-check', upload.single('file'), [
  body('query').optional().trim().isLength({ min: 0, max: 10000 })
], async (req, res) => {
  let fileContent = null

  // Process file if uploaded
  if (req.file) {
    const validation = validateFile(req.file)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    try {
      const extracted = await extractFileContent(req.file)
      fileContent = {
        ...extracted,
        metadata: {
          ...extracted.metadata,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype
        }
      }
    } catch (error) {
      return res.status(400).json({ error: `File processing failed: ${error.message}` })
    }
  }

  await handleAIRequest(req, res, 'clause-check', fileContent)
})

// Case Miner endpoint (with file upload support)
router.post('/case-miner', upload.single('file'), [
  body('query').optional().trim().isLength({ min: 0, max: 10000 })
], async (req, res) => {
  let fileContent = null

  // Process file if uploaded
  if (req.file) {
    const validation = validateFile(req.file)
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    try {
      const extracted = await extractFileContent(req.file)
      fileContent = {
        ...extracted,
        metadata: {
          ...extracted.metadata,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype
        }
      }
    } catch (error) {
      return res.status(400).json({ error: `File processing failed: ${error.message}` })
    }
  }

  await handleAIRequest(req, res, 'case-miner', fileContent)
})

// Legal Mind endpoint
router.post('/legal-mind', [
  body('query').trim().notEmpty().isLength({ min: 1, max: 10000 })
], async (req, res) => {
  await handleAIRequest(req, res, 'legal-mind')
})

export default router


