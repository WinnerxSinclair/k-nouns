import User from '../models/user.js'
import Flashcard from '../models/flashcard.js'
import FlashcardGroup from '../models/cardGroup.js'
import mongoose from 'mongoose'
const { startSession } = mongoose;

const removeTag = async (req, res) => {
  const uid = req.profile._id;
  const { tagName } = req.params;
  const session = await startSession();
  try{
    session.startTransaction();
    await User.updateOne({ _id: uid }, { $pull: { tags: tagName } }, { session });
    await FlashcardGroup.updateMany({ uid }, { $pull: { tags: tagName } }, { session });
    await Flashcard.updateMany({ uid }, { $pull: { tags: tagName } }, { session });
    await session.commitTransaction();
    res.json({ message: 'deleted tag' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'failed to delete tag' });
  }
}

const updateTagName = async (req, res) => {
  const uid = req.profile._id;
  const { tagName } = req.params;
  const { newName } = req.body;
  const session = await startSession();
  try{
    session.startTransaction();
    await User.updateOne({ _id: uid, tags: tagName }, { $set: { 'tags.$': newName } }, { session });
    await FlashcardGroup.updateMany({ uid, tags: tagName }, { $set: { 'tags.$': newName } }, { session });
    await Flashcard.updateMany({ uid, tags: tagName }, { $set: { 'tags.$': newName } }, { session });
    await session.commitTransaction();
    res.json({ message: 'tag name updated' });
  }catch{
    console.error(err);
    res.status(500).json({ message: 'failed to update tag name' });
  }
}


export default {
  removeTag,
  updateTagName
}