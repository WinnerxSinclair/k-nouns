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
})



//ai functions

export const translate = async (input) => {
  const response = await api.post('/api/ai/translate', input);
  return response.data;
}

export const explain = async (input) => {
  const response = await api.post('/api/ai/explain', input);
  return response.data
}



//flashcards

export const createCardGroup = async (input) => {
  const response = await api.post('/api/card_collections', input);
  return response.data;
}

export const deleteCollection = async (q) => {
  const response = await api.delete(`/api/card_collections/${q}`);
  return response.data;
}
export const getCollections = async (q) => {
  const response = await api.get('/api/card_collections', {
    params: q
  });

  return response.data;
}

export const getCollectionById = async (q) => {
  const response = await api.get(`/api/card_collections/${q}`);
  return response.data;
}

export const updateCollectionName = async (q, payload) => {
  const response = await api.patch(`/api/card_collections/${q}/nameChange`, payload);
  return response.data;
}

export const getCards = async (q) => {
  const response = await api.get(`/api/card_collections/${q}/cards`);
  return response.data;
}

export const getCollectionTags = async (q) => {
  const response = await api.get(`/api/card_collections/${q}/tags`);
  return response.data;
}

export const createCard = async (q, input) => {
  const response = await api.post(`/api/card_collections/${q}/cards`, input);
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

//review -  related to flashcards
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


//updating usertags - related to flashcards
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

export const getTags = async() => {
  const response = await api.get('/api/user/tags');
  return response.data;
}


export default api;