import Share from '../models/share.js'
import Deck from '../models/deck.js'
import Card from '../models/card.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js';
const checkShare = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const { code, deckId, ownerId = uid } = req.body;
  console.log(code)
  console.log(deckId);
 
  
  const doc = await Share.findOneAndUpdate(
    { deckId, ownerId }, 
    { 
      $set: { expiresAt: tomorrow },
      $setOnInsert: { _id: code } 
    },
    { 
      upsert: true,
      new: true 
    }
  ).select('_id')
  res.json(doc);
  
});

const importShare = asyncHandler(async (req, res) => {
  const uid = new mongoose.Types.ObjectId(); //CHANGE THIS LATER
  const { _id } = req.body;
  const customId = new mongoose.Types.ObjectId();
  const [doc] = await Share.aggregate([
     { $match: { _id } },
     {
       $lookup: {
         from: 'decks',
         localField: 'deckId',
         foreignField: '_id',
         pipeline: [
           { $project: { _id: 0, name: 1, tags: 1 } }
         ],
         as: 'deckStuff'
       }
     },
     {
       $lookup: {
         from: 'cards',
         localField: 'deckId',
         foreignField: 'deckId',
         pipeline: [
           { 
             $project: { 
               _id: 0, context: 1, front: 1, back: 1, explanation: 1, tags: 1, 
               reps: { $literal: 0 }, 
               interval: { $literal: 0 }, 
               ease: { $literal: 2.5 }, 
               due: { $literal: new Date() },
               lapses: { $literal: 0 },
               deckId: { $literal: customId },
               uid: { $literal: uid }
             } 
           }
         ],
         as: 'cards'
       }
     },
     { $unwind: '$deckStuff' },
    
     { $project: { deckName: '$deckStuff.name', tags: '$deckStuff.tags', cards: 1, _id: 0 } }
  ]);

  
  if(!doc){
    return res.status(404).json({ message: 'Deck does not exist or share code expired' });
  }
  
  const session = await mongoose.startSession();
  try{
    session.startTransaction();
    await Deck.insertOne({ _id: customId, name: doc.deckName, tags: doc.tags, uid }, { session });
    await Card.insertMany(doc.cards, { session });
    await session.commitTransaction();
    res.json({ message: 'success' });
  }catch(err){
    await session.abortTransaction();
    throw err;
  }finally{
    session.endSession();
  }
});

export default {
  checkShare,
  importShare
}