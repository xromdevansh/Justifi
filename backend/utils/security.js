// Input sanitization to prevent prompt injection
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove potentially dangerous patterns
  let sanitized = input
    .trim()
    // Remove attempts to override system prompts
    .replace(/system\s*[:=]/gi, '')
    .replace(/instruction\s*[:=]/gi, '')
    .replace(/ignore\s+previous/gi, '')
    .replace(/forget\s+everything/gi, '')
    // Remove excessive newlines
    .replace(/\n{5,}/g, '\n\n')
    // Limit length to prevent abuse
    .substring(0, 10000)

  return sanitized
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}


