import Share from '../models/share.js'
import FlashcardGroup from '../models/cardGroup.js'
import Flashcard from '../models/flashcard.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js';
const checkShare = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const { code, groupId, ownerId = uid } = req.body;
  console.log(code)
  console.log(groupId);
 
  
  const doc = await Share.findOneAndUpdate(
    { groupId, ownerId }, 
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
         from: 'card_groups',
         localField: 'groupId',
         foreignField: '_id',
         pipeline: [
           { $project: { _id: 0, name: 1, tags: 1 } }
         ],
         as: 'groupStuff'
       }
     },
     {
       $lookup: {
         from: 'flashcards',
         localField: 'groupId',
         foreignField: 'groupId',
         pipeline: [
           { 
             $project: { 
               _id: 0, context: 1, front: 1, back: 1, explanation: 1, tags: 1, 
               reps: { $literal: 0 }, 
               interval: { $literal: 0 }, 
               ease: { $literal: 2.5 }, 
               due: { $literal: new Date() },
               lapses: { $literal: 0 },
               groupId: { $literal: customId },
               uid: { $literal: uid }
             } 
           }
         ],
         as: 'cards'
       }
     },
     { $unwind: '$groupStuff' },
    
     { $project: { groupName: '$groupStuff.name', tags: '$groupStuff.tags', cards: 1, _id: 0 } }
  ]);

  
  if(!doc){
    return res.status(404).json({ message: 'Collection does not exist or share code expired' });
  }
  
  const session = await mongoose.startSession();
  try{
    session.startTransaction();
    await FlashcardGroup.insertOne({ _id: customId, name: doc.groupName, tags: doc.tags, uid }, { session });
    await Flashcard.insertMany(doc.cards, { session });
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