
import Card from "../models/card.js";
import Deck from "../models/deck.js";
import User from "../models/user.js";
import mongoose from 'mongoose'
import { MAX_DECKS, MAX_TAGS } from "../../shared/constants/zod/validation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const { startSession } = mongoose

//decks
const createDeck = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { name } = req.body;
  const current = await Deck.countDocuments({ uid });
  if(current >= MAX_DECKS) return res.status(403).json({ message: 'Deck cap reached' });
  try{
    const exists = await Deck.exists({ uid, name });
    if(exists){
      return res.status(409).json({ message: 'dupe name' });
    }
   
    const doc = await Deck.insertOne({ uid, name });
    res.status(201).json({ id: doc._id, message: 'deck added' });
  }catch(err){
    if(err.code === 11000){
      return res.status(409).json({ message: 'dupe name' });
    }
    next(err);
  }

});

const deleteDeck = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { deckId } = req.params;
  
  const session = await startSession();
  try{
    session.startTransaction();
    await Deck.deleteOne({ uid, _id: deckId }, { session });
    await Card.deleteMany({ uid, deckId: deckId }, { session });
    await session.commitTransaction();
    res.json({ message: 'delete deck and cards' });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    next(err);
  }finally{
    await session.endSession();
  }
});

const getDecks = asyncHandler(async (req, res) => {
  const uid = req.profile._id;

  const decks = await Deck.find({ uid: uid }, { _id: 1, name: 1 }).sort({ name: 1}).lean();
  res.json(decks)
  
});

const getDeckById = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { deckId } = req.params;
  
  const deck = await Deck.findOne({ _id: deckId, uid }).lean();
  if(!deck) return res.status(404).json({ message: 'Deck dont exist' });
  res.json(deck);
  
})

const getDeckTags = async (req, res) => {
  const { deckId } = req.params;
  try {
    const grp = await Deck.findOne({ _id: deckId, uid: req.profile._id })
                               .select('tags -_id')
                               .lean();
    res.json(grp?.tags ?? {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'error getting tags' });
  }
};

const updateDeckName = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { deckId } = req.params;
  const { name } = req.body;
  
  const stats = await Deck.updateOne({ uid, _id: deckId }, { name });
  if(stats.matchedCount === 0){
    return res.status(400).json({ message: 'no matching docs' });
  }
  res.json({ message: 'succesfully changed name' });
  
});

const exportDeck = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { deckId, mode } = req.body;
  

  let selectArr = ['-uid', '-__v', '-createdAt', '-updatedAt', '-_id'];
  if(mode === 'share'){
    ['-reps', '-interval', '-ease', '-due', '-lapses', '-deckId'].forEach((srs) => selectArr.push(srs));
  } 
  
  const cards = await Card.find({ uid, deckId }).select(selectArr.join(' ')).lean();
  if(!cards.length) return res.status(404).json({ message: 'no cards' });

  const payload = {
    meta: {
      mode,
      schemaVersion: 1,
      exportedAt: new Date().toISOString()
    },
    cards
  }

  const filename = `deck-${deckId}-${mode}-${Date.now()}.json`;

  res.status(200)
     .set({
       'Content-Type': 'application/json',
       'Content-Disposition': `attachment; filename="${filename}"`
     })
     .send(JSON.stringify(payload, null, 2));
});


export const importDeck = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { deckId, name } = req.body;
  console.log(deckId, name);
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  if(req.file.mimetype !== 'application/json') return res.status(400).json({ error: 'wrong file type' });
  if(!deckId && !name) return res.status(400).json({ error: 'need option for new cards' });
  if(deckId && !mongoose.Types.ObjectId.isValid(deckId)){
    return res.status(400).json({ error: 'invalid deckid'})
  }
  if((name && typeof name !== 'string') || (name && name.trim() === '')){
    return res.status(400).json({ error: 'invalid name' });
  }
  const rawText = req.file.buffer.toString('utf8'); 
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return res.status(400).json({ message: 'Bad JSON' });
  }

  let newDeckId;
  const newDeck = new Deck({ uid, name });
  if(name){
    console.log(newDeck);
    newDeckId = newDeck._id;
  }else{
    newDeckId = deckId;
  }
  console.log(newDeckId)
  const allDecks = await Deck.find({ uid }).lean();
  const deckIds = new Set(allDecks.map((deck) => deck._id.toString()));
  let createNewDeck = false;
  console.log(deckIds);
  const { meta = {}, cards = [] } = parsed;
  if(meta.schemaVersion !== 1)
    return res.status(400).json({ error: 'unsupported schema version' });
  if(!cards.length)
    return res.status(400).json({ error: 'no cards' });
  
  const tagSet = new Set();
  const ops = [];
  for(let card of cards){
    const doc = { ...card };
    doc.uid = uid;
    if(!mongoose.Types.ObjectId.isValid(doc?.deckId) || !deckIds.has(doc?.deckId)){
      doc.deckId = newDeckId;
      createNewDeck = true;
    }
    if (!doc.cardId) doc.cardId = crypto.randomUUID();
    (doc.tags ?? []).forEach((tag) => tagSet.add(tag.trim()));
    
    
    ops.push({
      updateOne: {
        filter: { uid, cardId: doc.cardId },
        update: { $set: doc },
        upsert: true
      }
    });
  }

  if(createNewDeck && name){
    await newDeck.save();
  }
  const result = await Card.bulkWrite(ops, { ordered: false });
  const newTags = Array.from(tagSet);
  await User.findByIdAndUpdate(uid, { $addToSet: { tags: { $each: newTags } } });
  console.log(result);
  res.json({
    inserted: result.insertedCount,
    updated: result.modifiedCount,
    skipped: cards.length - (result.insertedCount + result.modifiedCount)
  });

});



//cards
const createCard = asyncHandler(async (req, res) => {
  const { 
    context, front, back,
    explanation, mirror, tags = []
  } = req.body;
  const { deckId } = req.params;
  const uid = req.profile._id;

  const pairId = mirror ? crypto.randomUUID() : undefined;

  const baseDoc = {
    uid,
    deckId,
    context,
    explanation,
    tags, 
  };
  
  const docs = mirror
    ? [
        { ...baseDoc, pairId, front, back },
        { ...baseDoc, pairId, front: back, back: front }
      ]
    : [ {...baseDoc, front, back }];

  await Card.insertMany(docs);

  res.status(201).json({ message: 'card added' });

});


const getDashboardCards = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { decks = [], tags = [], conditional = '$all' } = req.body;
  if(!decks.length && !tags.length){
    return res.status(400).json({ message: 'no filters' }); 
  }
  let query = { uid };
  if(decks.length){
    query.deckId = { $in: decks };
  }
  if(tags.length){
    query.tags = { [conditional]: tags };
  }
  const cards = await Card.find(query).lean();
  res.json(cards);
});


async function schedule ({ reps, interval, ease, lapses }, quality) {
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

const gradeCard = asyncHandler(async (req, res) => { 
  const { grade, ...card } = req.body;
  const uid = req.profile._id;
 
  let gradedCard = Object.assign({}, card, await schedule(card, grade));
  console.log('graded card', gradedCard)
  const newCard = await Card.updateOne({ _id: card._id, uid }, gradedCard);
  console.log('newcard', newCard);
  res.json({ message: 'card graded' });
  
});

const getCardBatch = asyncHandler(async (req, res) => {
  let { decks = [], tags = [], conditional = '$or' } = req.body;
  const uid = req.profile._id;
  const want = 10;

  if(!decks.length || !tags.length){
    conditional = '$or';
  } 

  const cardBatch = await Card.find({
    uid: uid,
    due: { $lte: Date.now() + 5*60*1000 },
    [conditional]: [{ deckId: { $in: decks } }, {tags: { $in: tags }}]
  })
  .sort({ due: 1 })
  .limit(want)
  .select('-uid')
  .lean();

  res.json({ cards: cardBatch });

});



const getCard = async (req, res) => { 
  const { cardId } = req.params;
  const uid = req.profile._id;
  try{
    const card = await Card.findOne({ _id: cardId, uid })
                           .select('back context explanation front deckId pairId tags');
    
    if(!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'error getting card' });
  }
}

const updateCard = asyncHandler(async (req, res) => {
  const { front, back, context, explanation, tags, mirror, pairId, deckId } = req.body;
  const { cardId } = req.params;
  const uid = req.profile._id;
  const session = await startSession();
  try{
    session.startTransaction();
    if(!pairId && mirror){
      const newPairId = crypto.randomUUID();
      const cardId = crypto.randomUUID();
      await Card.updateOne({ _id, uid }, { front, back, context, explanation, tags, pairId: newPairId }, { session });
      await Card.insertOne({ uid, deckId, cardId, front: back, back: front, context, explanation, tags, pairId: newPairId }, { session });
    }else if(pairId && mirror){
      await Card.updateOne({ _id, uid }, { front, back, context, explanation, tags }, { session });
      await Card.updateOne({ _id: { $ne: _id }, pairId, uid }, { front: back, back: front, context, explanation, tags }, { session });
    }else{
      console.log('here')
      const doc = await Card.updateOne({ _id: cardId, uid }, { front, back, context, explanation, tags }, { session });
      console.log(doc);
    }
    await session.commitTransaction();
    res.json({ message: 'updated cards successfully' });
  }catch(err){
    await session.abortTransaction();
    console.error(err);
    next(err);
    
  }finally{
     await session.endSession();
  }
  
});

const dueCardCounts = asyncHandler(async (req, res) => { //MIGHT NEED TO CHECK IF RESULTS ARE EMPTY
  const uid = req.profile._id;
  let now = new Date();
  let twoMinutesFromNow = new Date(now.getTime() + 2 * 60 * 1000);
  

  let [allDecks, allTags] = await Promise.all([
    Deck.find({ uid }).select('_id name').lean(),
    User.find({ _id: uid }).select('tags').lean()
  ]);

  let [dueCounts] = await Card.aggregate([
    { $match: { uid: uid, due: { $lte: twoMinutesFromNow } } },
    {
      $facet: {
        byDeck: [
          { $group: { _id: '$deckId', due: { $sum: 1 } } }
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

  const deckDueCounts = dueCounts.byDeck.reduce((acc, cur) => {
    acc[cur._id] = cur.due;
    return acc;
  }, {});
  
  const tagDueCounts = dueCounts.byTags.reduce((acc, cur) => {
    acc[cur._id] = cur.due;
    return acc;
  }, {});
  console.log(allTags)
  console.log(tagDueCounts);
  const sortedDecks = allDecks.sort((a, b) => {
    const aDue = deckDueCounts[a._id] || 0;
    const bDue = deckDueCounts[b._id] || 0;
    
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

  const mappedDecks = sortedDecks.map(col => ({
    ...col,
    dueCount: deckDueCounts[col._id] ?? 0
  }));
  const decksWithDueCards = mappedDecks.filter((col) => col.dueCount > 0).map((c) => c._id);


  const mappedTags = sortedTags.map((tag) => ({
    name: tag,
    dueCount: tagDueCounts[tag] ?? 0
  }));
  
  const tagsWithDueCards = mappedTags.filter((tag) => tag.dueCount > 0).map((t) => t.name);

  res.json({
    totalDue: dueCounts.totalDue[0]?.total ?? 0,
    decks: mappedDecks ?? [],
    tags: mappedTags ?? [],
    decksWithDueCards: decksWithDueCards ?? [],
    tagsWithDueCards: tagsWithDueCards ?? [],
  });

});




const addTag = asyncHandler(async (req, res) => {
  const uid = req.profile._id;

  const { tags } = await User.findById(uid).select('tags').lean();
  if(tags.length >= MAX_TAGS) return res.status(403).json({ message: 'Breached tag cap' });

  const { tag, cardIds, pairIds } = req.body;
  const filter = { uid, $or: [ { _id: { $in: cardIds } }, { pairId: { $in: pairIds } }] };
  const session = await startSession();
  try{
    session.startTransaction();
    await Card.updateMany(filter, { $addToSet: { tags: tag } }, { session });
    await User.findByIdAndUpdate(uid, { $addToSet: { tags: tag } },  { session });
    await session.commitTransaction();
    res.status(201).json({ message: 'tag added' });
  }catch(err){
    console.error(err);
    session.abortTransaction();
    next(err);
  }finally{
    await session.endSession();
  }
});

const removeTag = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { tag, cardIds, pairIds } = req.body;
  const filter = { uid, $or: [ { _id: { $in: cardIds } }, { pairId: { $in: pairIds } }] };
  await Card.updateMany(filter, { $pull: { tags: tag } });
  res.sendStatus(204);
});

const updateDueDate = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { due, cardIds, pairIds } = req.body;
  const filter = { uid, $or: [ { _id: { $in: cardIds } }, { pairId: { $in: pairIds } }] };
  let dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Number(due));
  await Card.updateMany(filter, { $set: { due: dueDate } });
  res.sendStatus(204); //SEND CARDS BACK??
});

const resetSrs = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { cardIds, pairIds } = req.body;
  const filter = { uid, $or: [ { _id: { $in: cardIds } }, { pairId: { $in: pairIds } }] };
  await Card.updateMany(filter, {
    $set: { interval: 0, ease: 2.5, reps: 0, lapses: 0, due: new Date() }
  });
  res.sendStatus(204);
});

const deleteCards = asyncHandler(async (req, res) => {
  const uid = req.profile._id;
  const { cardIds, pairIds } = req.body;
  const filter = { uid, $or: [ { _id: { $in: cardIds } }, { pairId: { $in: pairIds } }] };
  await Card.deleteMany(filter);
  res.sendStatus(204);
});



export default { 
  createDeck,
  deleteDeck, 
  createCard,
  updateCard, 
  getDecks, 
  getDeckTags, 
  getDeckById,
  getCardBatch,
  gradeCard,
  dueCardCounts,
  getCard,
  updateDeckName,
  getDashboardCards,
  exportDeck,
  importDeck,
  addTag,
  removeTag,
  updateDueDate,
  resetSrs,
  deleteCards
}