import { useState } from 'react'
import { X, Send, Download, Copy, Check, Upload, FileText } from 'lucide-react'
import api from '../utils/api'

const FeatureModal = ({ isOpen, onClose, feature }) => {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  
  // Check if this feature supports file uploads
  const supportsFileUpload = feature?.id === 'clause-check' || feature?.id === 'case-miner'

  if (!isOpen || !feature) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      setSelectedFile(null)
      setFileError('')
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'text/markdown', 'application/rtf']
    const allowedExtensions = ['.pdf', '.txt', '.md', '.rtf']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setFileError('Please upload a PDF, TXT, MD, or RTF file')
      setSelectedFile(null)
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setFileError('File size must be less than 10MB')
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setFileError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResponse('')
    setFileError('')

    // Validate that either query or file is provided
    if (!query.trim() && !selectedFile) {
      setError('Please provide a query or upload a file')
      setLoading(false)
      return
    }

    try {
      const endpointMap = {
        'express-draft': '/express-draft',
        'clause-check': '/clause-check',
        'case-miner': '/case-miner',
        'legal-mind': '/legal-mind'
      }

      const endpoint = endpointMap[feature.id] || '/ask'

      // If file is selected, use FormData
      if (selectedFile && supportsFileUpload) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        if (query.trim()) {
          formData.append('query', query)
        }

        const response = await api.post(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        setResponse(response.data.response || response.data.result)
      } else {
        // Regular JSON request
        const response = await api.post(endpoint, { query })
        setResponse(response.data.response || response.data.result)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([response], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${feature.id}-result.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full p-8 relative shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-heading font-bold text-primary mb-2">
            {feature.title}
          </h2>
          <p className="text-secondary">{feature.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {supportsFileUpload ? 'Enter your query (optional if uploading a file)' : 'Enter your legal query or document'}
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required={!supportsFileUpload || !selectedFile}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-text resize-none"
                placeholder={
                  feature.id === 'express-draft'
                    ? 'Describe the legal document you need...'
                    : feature.id === 'clause-check'
                    ? 'Enter your query or upload a document to analyze...'
                    : feature.id === 'case-miner'
                    ? 'Describe the legal issue or upload a case document...'
                    : 'Ask your legal question...'
                }
              />
            </div>

            {supportsFileUpload && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Upload Document (PDF, TXT, MD, RTF) - Optional
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.md,.rtf,application/pdf,text/plain,text/markdown,application/rtf"
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center space-x-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent transition-colors"
                  >
                    <Upload size={20} className="text-secondary" />
                    <span className="text-sm text-secondary">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                    </span>
                  </label>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-green-600">
                    <FileText size={16} />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setFileError('')
                        const input = document.getElementById('file-upload')
                        if (input) input.value = ''
                      }}
                      className="text-red-600 hover:text-red-700 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {fileError && (
                  <div className="mt-2 text-sm text-red-600">{fileError}</div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Submit Query</span>
                </>
              )}
            </button>
          </div>
        </form>

        {response && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-primary">Result</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="bg-background rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-text text-sm leading-relaxed font-mono">
                {response}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeatureModal

