import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  uid:         { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  group_id:    { type: mongoose.Schema.Types.ObjectId, 
                 required: true,
                 index: true 
               },
  context:     { type: String, required: false },
  front:       { type: String, required: false },
  back:        { type: String, required: true },
  explanation: { type: String, required: false },
  pairId:      { type: String, required: false, index: true },
  tags:        { type: [String], default: [] },
  reps: Number,
  interval: Number,
  ease: Number,
  due: Date,
  lapses: Number
  
}, { timestamps: true });

export default mongoose.model('Flashcard', flashcardSchema);

