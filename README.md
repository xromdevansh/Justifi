# 🎯 JUSTIFI — Your AI Legal Partner, Reimagined

A comprehensive AI-powered legal research and document automation platform built with React, Node.js, and Google Gemini AI.

## 🚀 Features

- **Express Draft**: AI-powered generation of legal documents
- **Clause Check**: Instant extraction and interpretation of complex clauses
- **Case Miner**: Retrieve relevant precedents and case summaries
- **Legal Mind**: Deep legal reasoning assistant
- **Secure Authentication**: JWT-based user authentication
- **Query Logging**: Track all AI interactions
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠 Tech Stack

### Frontend
- React.js 18
- TailwindCSS
- Vite
- Lucide Icons
- Axios

### Backend
- Node.js (Express)
- MongoDB (Mongoose)
- Google Gemini AI
- JWT Authentication
- Bcrypt for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Google Gemini API Key

### Setup Steps

1. **Clone the repository** (or navigate to project folder)

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**:
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/justifi
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   GEMINI_API_KEY=your-gemini-api-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local instance):
   ```bash
   # On macOS with Homebrew:
   brew services start mongodb-community
   
   # On Linux:
   sudo systemctl start mongod
   
   # On Windows:
   # Start MongoDB service from Services panel
   ```

5. **Run the application**:

   **Option 1: Run both frontend and backend separately**
   
   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```
   
   **Option 2: Using the root package.json scripts** (run in separate terminals)
   ```bash
   npm run dev:backend
   npm run dev:frontend
   ```

6. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 🔐 Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to `backend/.env` as `GEMINI_API_KEY`

## 📁 Project Structure

```
justifi-platform/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── AskJustifi.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Confidentiality.jsx
│   │   │   ├── Trust.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoginModal.jsx
│   │   │   └── FeatureModal.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── QueryLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── ai.js
│   ├── services/
│   │   └── geminiService.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── security.js
│   ├── server.js
│   └── package.json
├── documentation/
│   └── workflow-diagram.md
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### AI Tools (Require Authentication)
- `POST /api/ask` - Generic legal query
- `POST /api/express-draft` - Generate legal documents
- `POST /api/clause-check` - Analyze legal clauses
- `POST /api/case-miner` - Find case precedents
- `POST /api/legal-mind` - Deep legal reasoning

### Request Format
```json
{
  "query": "Your legal question or document content"
}
```

### Response Format
```json
{
  "success": true,
  "response": "AI-generated response...",
  "tool": "express-draft"
}
```

## 🎨 Design System

### Colors
- **Primary**: Midnight Blue (#1A1F71)
- **Secondary**: Slate Grey (#4B5563)
- **Accent**: Gold (#D4AF37)
- **Background**: Ivory (#FAFAFA)
- **Text**: Charcoal (#111827)

### Typography
- **Headings**: Playfair Display
- **Subheadings**: DM Sans
- **Body**: Inter

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input sanitization to prevent prompt injection
- CORS protection
- Rate limiting
- Helmet.js for security headers
- Encrypted data storage
- Secure API routes

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `cd frontend && npm install && npm run build`
4. Set output directory: `frontend/dist`

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables in the dashboard

## ⚠️ Legal Disclaimer

Justifi is a technology platform providing AI-powered legal research and document automation tools. Justifi is not a law firm and does not provide legal advice. The use of Justifi's services does not create an attorney-client relationship. All outputs should be reviewed by qualified legal professionals.

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@justifi.com or create an issue in the repository.

---

Built with ❤️ for legal professionals


