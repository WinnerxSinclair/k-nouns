// api.js
import axios from 'axios';
import { auth } from '../firebase.js';

const api = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true
});

// For requests
api.interceptors.request.use(async (config) => {
  const u = auth.currentUser

  if (u) {
    const token = await u.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
});



//ai functions

export const translate = async (input) => {
  const response = await api.post('/api/ai/translate', input);
  return response.data;
}

export const explain = async (input) => {
  const response = await api.post('/api/ai/explain', input);
  return response.data
}



//cards

export const createDeck = async (input) => {
  const response = await api.post('/api/decks', input);
  return response.data;
}

export const deleteDeck = async (q) => {
  const response = await api.delete(`/api/decks/${q}`);
  return response.data;
}
export const getDecks = async (q) => {
  const response = await api.get('/api/decks', {
    params: q
  });

  return response.data;
}

export const getDeckById = async (q) => {
  const response = await api.get(`/api/decks/${q}`);
  return response.data;
}

export const exportDeck = async (payload) => {
  const response = await api.post('/api/decks/export', payload, { responseType: 'blob' });
  return response.data;
}

export const importDeck = async (payload) => {
  console.log(payload)
  const response = await api.post('/api/decks/import', payload);
  return response.data;
}

export const updateDeckName = async (q, payload) => {
  const response = await api.patch(`/api/decks/${q}/nameChange`, payload);
  return response.data;
}

export const getCards = async (q) => {
  const response = await api.get(`/api/decks/${q}/cards`);
  return response.data;
}

export const getDeckTags = async (q) => {
  const response = await api.get(`/api/decks/${q}/tags`);
  return response.data;
}

export const createCard = async (q, input) => {
  const response = await api.post(`/api/decks/${q}/cards`, input);
  return response.data;
}

export const deleteCard = async (q) => {
  const response = await api.delete(`/api/cards/${q}`);
  return response.data;
}

export const getCard = async (q) => {
  const response = await api.get(`/api/cards/${q}`);
  return response.data;
}

export const updateCard = async (q, payload) => {
  const response = await api.post(`/api/cards/${q}`, payload);
  return response.data;
}

export const getDashboardCards = async (payload) => {
  const response = await api.post('/api/cards', payload);
  return response.data;
}

//review -  related to cards
export const getReviewBatch = async (payload) => {
  const response = await api.post(`/api/review`, payload);
  return response.data;
}

export const gradeCard = async (payload) => {
  const response = await api.put('/api/review/card', payload);
  return response.data;
}

export const getCardBatch = async (payload) => {
  const response = await api.post('/api/review/batch', payload);
  return response.data;
}

export const getDueCounts = async () => {
  const response = await api.get('/api/review/cards/due');
  return response.data;
}

export const bulkOps = async (payload) => {
  const response = await api.patch('/api/cards/bulk', payload);
  return response.data;
}

export const addTag = async (payload = { tag, cardIds, pairIds }) => {

  const response = await api.post('/api/cards/bulk/tags', payload);
  return response.data;
}

export const removeTag = async (payload = { tag, cardIds, pairIds }) => {
  const response = await api.patch('/api/cards/bulk/tags', payload);
  return response.data;
}

export const updateDueDate = async (payload = { due, cardIds, pairIds }) => {
  const response = await api.patch('/api/cards/bulk/due', payload);
  return response.data;
}

export const resetSrs = async (payload = { cardIds, pairIds }) => {
  const response = await api.patch('/api/cards/bulk/srs', payload);
  return response.data;
}

export const deleteCards = async (payload = { cardIds, pairIds }) => {
  const response = await api.post('/api/cards/bulk', payload);
  return response.data;
}

//updating usertags
export const createTag = async (input) => {
  console.log(input)
  const response = await api.patch(`/api/user/tags`, input);
  return response.data;
}

export const updateTagName = async (q, payload) => {
  const response = await api.patch(`/api/tags/${q}`, payload);
  return response.data;
}

export const deleteTag = async (q) => {
  const response = await api.delete(`/api/tags/${q}`);
  return response.data;
}

export const getTags = async () => {
  const response = await api.get('/api/user/tags');
  return response.data;
}


//share -- DEPRECATED????

export const createOrUpdateShare = async (payload) => {
  const response = await api.patch('/api/share', payload);
  return response.data;
}

export const importShare = async (payload) => {
  const response = await api.post('/api/share', payload);
  return response.data;
}

//user (tokens)

export const checkTokens = async () => {
  const response = await api.get('/api/user/tokens');
  return response.data;
}
export default api;