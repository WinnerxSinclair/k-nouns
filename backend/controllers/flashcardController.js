
import Flashcard from "../models/flashcard.js";
import FlashcardGroup from "../models/cardGroup.js";
import User from "../models/user.js";
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

const deleteGroup = async (req, res) => {
  const uid = req.profile._id;
  const { collectionId } = req.params;
  console.log(collectionId);
  const session = await startSession();
  try{
    session.startTransaction();
    await FlashcardGroup.deleteOne({ uid, _id: collectionId }, { session });
    await Flashcard.deleteMany({ uid, groupId: collectionId }, { session });
    await session.commitTransaction();
    res.json({ message: 'delete group and cards' });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: 'error' });
  }finally{
    session.endSession();
  }
}

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
  const { collectionId } = req.params;
  try{
    const group = await FlashcardGroup.findOne({ _id: collectionId, uid }).lean();
    if(!group) return res.status(404).json({ message: 'Collection dont exist' });
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

const updateGroupName = async (req, res) => {
  const uid = req.profile._id;
  const { collectionId } = req.params;
  const { name } = req.body;
  try{
    await FlashcardGroup.updateOne({ uid, _id: collectionId }, { name });
    res.json({ message: 'succesfully changed name' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'error changing name' });
  }
}


//cards
const createCard = async (req, res) => {
  const { 
    groupId, context, front, back,
    explanation, mirror, tags = []
  } = req.body;
  const uid = req.profile._id;

  if(!groupId || !back){
    return res.status(400).json({ message: 'Group ID and back are required' });
  }

  const session = await startSession();
  session.startTransaction();
  try{
    const pairId = mirror ? crypto.randomUUID() : undefined;

    const srsSeed = { reps: 0, interval: 0, ease: 2.5, due: new Date(), lapses: 0 };
    const baseDoc = {
      uid,
      groupId,
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
      await FlashcardGroup.findByIdAndUpdate(groupId, { $addToSet: { tags: { $each: tags} } }, { session });
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
    const cards = await Flashcard.find({ uid: req.profile._id, groupId: collectionId }).lean();
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
      [conditional]: [{ groupId: { $in: collections } }, {tags: { $in: tags }}]
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

const getCard = async (req, res) => {
  const { cardId } = req.params;
  const uid = req.profile._id;
  try{
    const card = await Flashcard.findOne({ _id: cardId, uid }).select('back context explanation front groupId pairId tags');
    
    if(!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'error getting card' });
  }
}

const updateCard = async (req, res) => {
  const { _id, front, back, context, explanation, tags, mirror, pairId, groupId } = req.body;
  const uid = req.profile._id;
  const session = await startSession();
  try{
    session.startTransaction();
    if(!pairId && mirror){
      const newPairId = crypto.randomUUID();
      const srsSeed = { reps: 0, interval: 0, ease: 2.5, due: new Date(), lapses: 0 };
      await Flashcard.updateOne({ _id, uid }, { front, back, context, explanation, tags, pairId: newPairId }, { session });
      await Flashcard.insertOne({ uid, groupId, front: back, back: front, context, explanation, tags, pairId: newPairId, ...srsSeed }, { session });
    }else if(pairId && mirror){
      await Flashcard.updateOne({ _id, uid }, { front, back, context, explanation, tags }, { session });
      await Flashcard.updateOne({ _id: { $ne: _id }, pairId, uid }, { front: back, back: front, context, explanation, tags }, { session });
    }else{
      await Flashcard.updateOne({ _id, uid }, { front, back, context, explanation, tags }, { session });
    }
    await session.commitTransaction();
    res.json({ message: 'updated cards successfully' });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    session.endSession();
    res.status(500).json({ message: 'error updating cards' });
  }
  
}

const dueCardCounts = async (req, res) => {
  const uid = req.profile._id;
  let now = new Date();
  let twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);
  try{

    let [allCollections, allTags] = await Promise.all([
      FlashcardGroup.find({ uid }).select('_id name').lean(),
      User.find({ _id: uid }).select('tags').lean()
    ]);

    let [dueCounts] = await Flashcard.aggregate([
      { $match: { uid: uid, due: { $lte: twoMinutesFromNow } } },
      {
        $facet: {
          byCollection: [
            { $group: { _id: '$groupId', due: { $sum: 1 } } }
          ],
          byTags: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags', due: { $sum: 1 } } }
          ],
          totalDue: [
            { $group: { _id: null, total: { $sum: 1 } } }
          ]        
        }
      }
    ]).exec();

    allTags = allTags[0].tags;

    const collectionDueCounts = dueCounts.byCollection.reduce((acc, cur) => {
      acc[cur._id] = cur.due;
      return acc;
    }, {});
    
    const tagDueCounts = dueCounts.byTags.reduce((acc, cur) => {
      acc[cur._id] = cur.due;
      return acc;
    }, {});
    console.log(allTags)
    console.log(tagDueCounts);
    const sortedCollections = allCollections.sort((a, b) => {
      const aDue = collectionDueCounts[a._id] || 0;
      const bDue = collectionDueCounts[b._id] || 0;
      
      if(aDue > 0 && bDue > 0 && aDue > bDue) return -1;
      if(aDue > 0 && bDue > 0 && aDue < bDue) return 1;
      if (aDue > 0 && bDue === 0) return -1;
      if (aDue === 0 && bDue > 0) return 1;
      return a.name.localeCompare(b.name);
    });

    const sortedTags = allTags.sort((a, b) => {
      const aDue = tagDueCounts[a] || 0;
      const bDue = tagDueCounts[b] || 0;
      
      if(aDue > 0 && bDue > 0 && aDue > bDue) return -1;
      if(aDue > 0 && bDue > 0 && aDue < bDue) return 1;
      if (aDue > 0 && bDue === 0) return -1;
      if (aDue === 0 && bDue > 0) return 1;
      return a.localeCompare(b);
    });

    const mappedCols = sortedCollections.map(col => ({
      ...col,
      dueCount: collectionDueCounts[col._id] ?? 0
    }));
    const colsWithDueCards = mappedCols.filter((col) => col.dueCount > 0).map((c) => c._id);


    const mappedTags = sortedTags.map((tag) => ({
      name: tag,
      dueCount: tagDueCounts[tag] ?? 0
    }));
    
    const tagsWithDueCards = mappedTags.filter((tag) => tag.dueCount > 0).map((t) => t.name);

    res.json({
      totalDue: dueCounts.totalDue[0]?.total ?? 0,
      collections: mappedCols ?? [],
      tags: mappedTags ?? [],
      colsWithDueCards: colsWithDueCards ?? [],
      tagsWithDueCards: tagsWithDueCards ?? [],
    });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'problem aggregating counts' });
  }
}



export default { 
  createCardGroup,
  deleteGroup, 
  createCard,
  updateCard, 
  getGroups, 
  getCards, 
  getGroupTags, 
  getGroupById,
  getCardBatch,
  gradeCard,
  deleteCard,
  dueCardCounts,
  getCard,
  updateGroupName 
}