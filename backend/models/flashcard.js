import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  uid:         { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  group_id:    { type: mongoose.Schema.Types.ObjectId, 
                 required: true,
                 index: true 
               },
  context:     String,
  front:       { type: String, required: true },
  back:        { type: String, required: true },
  explanation: String,
  pairId:      { type: String, index: true },
  tags:        { type: [String], default: [] },
  reps: Number,
  interval: Number,
  ease: Number,
  due: Date,
  lapses: Number
  
}, { timestamps: true });

export default mongoose.model('Flashcard', flashcardSchema);

