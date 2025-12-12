import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const require = createRequire(import.meta.url)

// pdf-parse is a CommonJS module, use require to get it
// The module exports PDFParse class
const { PDFParse } = require('pdf-parse')

/**
 * Extract text content from uploaded file
 * Supports: PDF, TXT, DOCX (basic), and other text files
 */
export const extractFileContent = async (file) => {
  if (!file) {
    return null
  }

  const fileExtension = path.extname(file.originalname).toLowerCase()
  const filePath = file.path

  try {
    switch (fileExtension) {
      case '.pdf':
        return await extractFromPDF(filePath)
      
      case '.txt':
      case '.md':
      case '.rtf':
        return await extractFromText(filePath)
      
      case '.docx':
        // For DOCX, we'd need mammoth or similar library
        // For now, return a message that DOCX is not fully supported
        throw new Error('DOCX files are not fully supported. Please convert to PDF or TXT format.')
      
      default:
        // Try to read as text for other file types
        try {
          return await extractFromText(filePath)
        } catch (error) {
          throw new Error(`Unsupported file type: ${fileExtension}. Supported formats: PDF, TXT, MD, RTF`)
        }
    }
  } finally {
    // Clean up uploaded file
    try {
      await fs.unlink(filePath)
    } catch (error) {
      console.error('Error deleting temporary file:', error)
    }
  }
}

/**
 * Extract text from PDF file
 */
const extractFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath)
    
    // Use PDFParse class to extract text
    const parser = new PDFParse({ data: dataBuffer })
    const result = await parser.getText()
    
    const data = {
      text: result.text,
      numpages: result.total,
      info: {}
    }
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('PDF file appears to be empty or contains only images. Please ensure the PDF has extractable text.')
    }
    
    return {
      text: data.text.trim(),
      pageCount: data.numpages,
      metadata: {
        title: data.info?.Title || '',
        author: data.info?.Author || '',
        subject: data.info?.Subject || ''
      }
    }
  } catch (error) {
    if (error.message.includes('empty')) {
      throw error
    }
    throw new Error(`Failed to extract text from PDF: ${error.message}`)
  }
}

/**
 * Extract text from plain text file
 */
const extractFromText = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    
    if (!content || content.trim().length === 0) {
      throw new Error('File appears to be empty')
    }
    
    return {
      text: content.trim(),
      pageCount: 1,
      metadata: {}
    }
  } catch (error) {
    if (error.message.includes('empty')) {
      throw error
    }
    throw new Error(`Failed to read text file: ${error.message}`)
  }
}

/**
 * Validate file before processing
 */
export const validateFile = (file, maxSizeMB = 10) => {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024
  const allowedExtensions = ['.pdf', '.txt', '.md', '.rtf', '.docx']
  const fileExtension = path.extname(file.originalname).toLowerCase()

  if (!allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type ${fileExtension} is not supported. Allowed types: ${allowedExtensions.join(', ')}`
    }
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
    }
  }

  return { valid: true }
}

