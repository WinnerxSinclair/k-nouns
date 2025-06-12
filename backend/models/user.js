import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  uid:          { type: String, required: true, unique: true },
  tokensUsed: {
    type: Number,
    default: 1500,
    required: true
  }, //not related to access or refresh tokens
  tags: { type: [String], default: [] } 
}, { timestamps: true });

export default mongoose.model('User', userSchema);