import mongoose from 'mongoose'
import Deck from '../models/deck.js'
import { deckNames } from './constants/mockDecks.js'
import { userId } from './constants/userId.js'
import { mongoConnect } from './mongoConnect.js'
await mongoConnect();
const payload = deckNames.map((name) => ({ uid: userId, name }));
console.log(payload);
const x = await Deck.insertMany(payload);
console.log('inserted')
process.exit();