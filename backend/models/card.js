import mongoose from 'mongoose';


const cardSchema = new mongoose.Schema({
  uid:         { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  deckId:      { type: mongoose.Schema.Types.ObjectId, 
                 required: true,
                 index: true 
               },
  cardId:      { type: String, required: true, default: () => crypto.randomUUID() },
  context:     { type: String },
  front:       { type: String, required: true },
  back:        { type: String, required: true },
  explanation: { type: String },
  pairId:      { type: String, index: true },
  tags:        { type: [String], default: [] },
  reps:        { type: Number, default: 0 },
  interval:    { type: Number, default: 0 },
  ease:        { type: Number, default: 2.5 },
  due:         { type: Date, default: () => new Date() },
  lapses:      { type: Number, default: 0 },
  
}, { timestamps: true });

cardSchema.index({ uid: 1, cardId: 1 }, { unique: true });

export default mongoose.model('Card', cardSchema);

