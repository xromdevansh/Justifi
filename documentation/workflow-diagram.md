# Justifi Workflow Diagram

## System Architecture Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INPUT                               │
│  (Legal Query, Document Draft Request, Clause Analysis, etc.)   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA INGESTION                              │
│  • Input Validation                                              │
│  • Sanitization (Prompt Injection Prevention)                   │
│  • Authentication Check (JWT)                                    │
│  • Rate Limiting                                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LEGAL KNOWLEDGE CORE                           │
│  • Tool Selection (Express Draft, Clause Check, etc.)           │
│  • System Prompt Configuration                                   │
│  • Context Preparation                                           │
│  • User History Retrieval (Optional)                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              AI PROCESSING (Gemini + RAG)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Google Gemini API                                        │  │
│  │  • Model: gemini-pro                                      │  │
│  │  • Custom System Prompts                                  │  │
│  │  • Legal Context Integration                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  RAG (Retrieval Augmented Generation)                    │  │
│  │  • Document Retrieval (Future Enhancement)               │  │
│  │  • Case Law Database (Future Enhancement)                │  │
│  │  • Legal Precedent Search (Future Enhancement)           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SECURE LAYER                               │
│  • Response Validation                                           │
│  • Error Handling                                                │
│  • Query Logging (MongoDB)                                       │
│  • Data Encryption                                               │
│  • Output Sanitization                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OUTPUT DASHBOARD                            │
│  • Formatted Legal Response                                      │
│  • Download Options                                              │
│  • Copy to Clipboard                                             │
│  • Query History                                                 │
│  • Export Capabilities                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Component Interactions

### 1. User Input
- **Source**: Frontend components (FeatureModal, Hero section)
- **Format**: Text queries, document content, legal questions
- **Validation**: Client-side and server-side

### 2. Data Ingestion
- **Authentication**: JWT token verification
- **Sanitization**: Remove prompt injection attempts
- **Rate Limiting**: Prevent API abuse
- **Validation**: Express-validator middleware

### 3. Legal Knowledge Core
- **Tool Routing**: Maps request to appropriate AI tool
- **Prompt Engineering**: Applies specialized system prompts
  - Express Draft: Document generation prompts
  - Clause Check: Analysis-focused prompts
  - Case Miner: Research-focused prompts
  - Legal Mind: Deep reasoning prompts

### 4. AI Processing
- **Primary**: Google Gemini API (gemini-pro model)
- **Enhanced Context**: System prompts provide legal domain expertise
- **Future**: RAG implementation for retrieval-augmented generation

### 5. Secure Layer
- **Query Logging**: MongoDB storage for audit trail
- **Encryption**: Data encrypted at rest and in transit
- **Error Handling**: Graceful failure with user-friendly messages
- **Security**: Input/output validation and sanitization

### 6. Output Dashboard
- **Display**: Formatted, readable legal content
- **Actions**: Copy, download, share options
- **History**: User can view past queries
- **Formatting**: Markdown support for structured output

## Security Flow

```
User Request
    │
    ▼
JWT Authentication ←─── Invalid Token → 401 Error
    │
    ▼
Input Sanitization ←─── Malicious Input → 400 Error
    │
    ▼
Rate Limiting ←─── Too Many Requests → 429 Error
    │
    ▼
AI Processing
    │
    ▼
Response Validation
    │
    ▼
Secure Logging (Encrypted)
    │
    ▼
User Response
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### QueryLogs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  tool: String (enum),
  query: String,
  response: String,
  metadata: Map,
  createdAt: Date,
  updatedAt: Date
}
```

## API Request/Response Flow

### Request Example
```http
POST /api/express-draft
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "query": "I need a non-disclosure agreement for a software development project"
}
```

### Response Example
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "response": "# NON-DISCLOSURE AGREEMENT\n\n...",
  "tool": "express-draft"
}
```

## Error Handling Flow

```
Error Occurs
    │
    ├─→ Authentication Error → 401 (Re-login required)
    ├─→ Validation Error → 400 (Invalid input)
    ├─→ Rate Limit Error → 429 (Too many requests)
    ├─→ AI API Error → 500 (Service unavailable)
    └─→ Database Error → 500 (Internal server error)
```

Each error type is handled gracefully with user-friendly messages.


