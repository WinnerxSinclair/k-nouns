import mongoose from "mongoose";

const ObjectId = mongoose.Schema.Types.ObjectId;
const deckSchema = new mongoose.Schema({
  uid:  { type: ObjectId, required: true, index: true },
  name: { 
    type: String, 
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 60, 
  },
  
}, { timestamps: true });

deckSchema.index({ uid: 1, name: 1 }, { unique: true });
export default mongoose.model('Deck', deckSchema);