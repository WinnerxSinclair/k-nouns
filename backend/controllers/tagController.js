import User from '../models/user.js'
import Card from '../models/card.js'
import Deck from '../models/deck.js'
import mongoose from 'mongoose'
import { asyncHandler } from '../utils/asyncHandler.js'
const { startSession } = mongoose;

const removeTag = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { tagName } = req.params;
  const session = await startSession();
  try{
    session.startTransaction();
    await User.updateOne({ _id: uid }, { $pull: { tags: tagName } }, { session });
    await Card.updateMany({ uid }, { $pull: { tags: tagName } }, { session });
    await session.commitTransaction();
    res.json({ message: 'deleted tag' });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    next(err);
  }finally{
    await session.endSession();
  }
});

const updateTagName = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { tagName } = req.params;
  const { newName } = req.body;
  const session = await startSession();
  try{
    session.startTransaction();
    await User.updateOne({ _id: uid, tags: tagName }, { $set: { 'tags.$': newName } }, { session });
    await Card.updateMany({ uid, tags: tagName }, { $set: { 'tags.$': newName } }, { session });
    await session.commitTransaction();
    res.json({ message: 'tag name updated' });
  }catch{
    await session.abortTransaction();
    console.error(err);
    next(err);
  }finally{
    await session.endSession();
  }
});




export default {
  removeTag,
  updateTagName
}