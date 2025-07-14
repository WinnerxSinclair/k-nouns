import mongoose from 'mongoose'

const shareSchema = new mongoose.Schema({
  _id: String,
  deckId: mongoose.Schema.Types.ObjectId,
  deckName: String,
  ownerId: mongoose.Schema.Types.ObjectId,
  expiresAt: Date
}, { timestamps: true });

shareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Share', shareSchema);