import mongoose from 'mongoose'

const queryLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tool: {
    type: String,
    enum: ['ask', 'express-draft', 'clause-check', 'case-miner', 'legal-mind'],
    required: true
  },
  query: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
})

export default mongoose.model('QueryLog', queryLogSchema)


