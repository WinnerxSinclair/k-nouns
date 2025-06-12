
import Flashcard from "../models/flashcard.js";
import FlashcardGroup from "../models/cardGroup.js";
import mongoose from 'mongoose'
const { startSession } = mongoose

//groups
const createCardGroup = async (req, res) => {
  const { name } = req.body;
  try{
    const entry = {
      uid: req.profile._id,
      name
    }

    const doc = await FlashcardGroup.insertOne(entry);
    res.status(201).json({ id: doc._id, message: 'group added' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'problem adding group' });
  }
};

const getGroups = async (req, res) => {
  const uid = req.profile._id;
  try{
    const groups = await FlashcardGroup.find({ uid: uid }, { _id: 1, name: 1 }).lean();
    res.json(groups)
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'error getting groups' });
  }
}

const getGroupById = async (req, res) => {
  const uid = req.profile._id;
  console.log(req.params);
  console.log('asdigbsidufgsiudfgs')
  const { collectionId } = req.params;
  try{
    const group = await FlashcardGroup.findOne({ _id: collectionId, uid }).lean();
    res.json(group);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'error getting group' });
  }
}

const getGroupTags = async (req, res) => {
  const { collectionId } = req.params;
  try {
    const grp = await FlashcardGroup.findOne({ _id: collectionId, uid: req.profile._id })
                               .select('tags -_id')
                               .lean();
    res.json(grp?.tags ?? {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'error getting tags' });
  }
};




//cards
const createCard = async (req, res) => {
  const { 
    group_id, context, front, back,
    explanation, mirror, tags = []
  } = req.body;
  const uid = req.profile._id;

  if(!group_id || !back){
    return res.status(400).json({ message: 'Group ID and back are required' });
  }

  const session = await startSession();
  session.startTransaction();
  try{
    const pairId = mirror ? crypto.randomUUID() : undefined;

    const srsSeed = { reps: 0, interval: 0, ease: 2.5, due: new Date(), lapses: 0 };
    const baseDoc = {
      uid,
      group_id,
      context,
      explanation,
      tags,
      ...srsSeed
    }
    
    const docs = mirror
      ? [
          { ...baseDoc, pairId, front, back },
          { ...baseDoc, pairId, front: back, back: front }
        ]
      : [ {...baseDoc, front, back }] 

    await Flashcard.insertMany(docs, { session });

   
    if(tags.length){
      await FlashcardGroup.findByIdAndUpdate(group_id, { $addToSet: { tags: { $each: tags} } }, { session });
    }
    await session.commitTransaction();
    res.status(201).json({ message: 'flashcard added' });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: 'error adding card' });
  }finally{
    session.endSession();
  }

}


const getCards = async (req, res) => {
  const { collectionId } = req.params;
  try{
    const cards = await Flashcard.find({ uid: req.profile._id, group_id: collectionId }).lean();
    res.json(cards);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'error getting cards' });
  }
}


function schedule ({ reps, interval, ease, lapses }, quality) {
  const now   = Date.now();
  const day   = 86400000;         
  const minute = 60000;

  if (quality <= 3) {
    lapses  += 1;
    reps     = 0;
    ease     = Math.max(1.3, ease - 0.2);    

    if (quality === 1) {
   
      interval = 0;        
      return {
        reps, interval, ease,
        due: new Date(now + 2 * minute),
        lapses
      };
    }

    interval = 1;
  }

  else {
    reps += 1;
    if      (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else                 interval = Math.round(interval * ease);

    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    ease = Math.max(1.3, ease);
  }

  return {
    reps, interval, ease,
    due: new Date(now + interval * day),
    lapses
  };
}

const gradeCard = async (req, res) => {
  const { card, grade } = req.body;
  const uid = req.profile._id;
  try{
    let gradedCard = Object.assign({}, card, schedule(card, grade));
    console.log('graded card', gradedCard)
    const newCard = await Flashcard.updateOne({ _id: card._id, uid }, gradedCard);
    console.log('newcard', newCard);
    res.json({ message: 'card graded' });
  }catch(err){
    res.status(500).json({ message: 'failed to grade card', error: err.message });
  }
}

const getCardBatch = async (req, res) => {
  const { want = 10, collections = [], tags = [], conditional = '$or' } = req.body;
  const uid = req.profile._id;
  try{
    const cardBatch = await Flashcard.find({
      uid: uid,
      due: { $lte: Date.now() + 5*60*1000 },
      [conditional]: [{ group_id: { $in: collections } }, {tags: { $in: tags }}]
    })
    .sort({ due: 1 })
    .limit(want)
    .lean()

    res.json({ cards: cardBatch });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'failed to get card batch', error: err.message });
  }
}

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const uid = req.profile._id;
  console.log(cardId)
  try{
    await Flashcard.deleteOne({ _id: cardId, uid });
    res.json({ message: 'card deleted' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'error deleting card' });
  }
}

const dueCardCounts = async (req, res) => {
  const uid = req.profile._id;
  let now = new Date();
  try{
    let [doc] = await Flashcard.aggregate([
      { $match: { uid: uid, due: { $lte: now } } },
      {
        $facet: {
          byCollection: [
            { $group: { _id: '$group_id', due: { $sum: 1 } } }
          ],
          tagsDue: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags' } }
          ],
          totalDue: [
            { $group: { _id: null, total: { $sum: 1 } } }
          ]        
        }
      }
    ]).exec();

   console.log(doc);
    let transformToMap = doc.byCollection.reduce((acc, cur) => {
      acc[cur._id] = cur.due;
      return acc;
    }, {});

   
    res.json({
      totalDue: doc.totalDue[0]?.total ?? 0,
      byCollection: transformToMap,
      tagsWithDue: doc.tagsDue ?? [],
    });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'problem aggregating counts' });
  }
}


export default { 
  createCardGroup, 
  createCard, 
  getGroups, 
  getCards, 
  getGroupTags, 
  getGroupById,
  getCardBatch,
  gradeCard,
  deleteCard,
  dueCardCounts 
}