import Card from "../models/card.js";
import Deck from "../models/deck.js"
import User from '../models/user.js'
import { mongoConnect } from "./mongoConnect.js";
import { mockCards } from "./constants/mockCards.js";
import { userId } from "./constants/userId.js";

await mongoConnect();

let tagSet = new Set();
const decks = await Deck.find().select('_id');
let deckIds = decks.map((deck) => deck._id);
let cards = mockCards.map((card) => {
  if(card.mirror){
    card.pairId = crypto.randomUUID();
    delete card.mirror;
  }
  card.deckId = deckIds[Math.floor(Math.random() * deckIds.length)];
  card.uid = userId;
  return card;
});

let finishedCards = [];
cards.forEach((card) => {
  card.tags.forEach((t) => tagSet.add(t));
  finishedCards.push(card);
  if(card.pairId){
    finishedCards.push({ ...card, front: card.back, back: card.front });
  }
});

await User.findByIdAndUpdate(userId, { $set: { tags: Array.from(tagSet) } });
await Card.insertMany(finishedCards);
console.log('cards inserted');
process.exit();




