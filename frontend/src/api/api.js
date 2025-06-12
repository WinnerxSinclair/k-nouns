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

export const fetchCollections = async (q) => {
  const response = await api.get('/api/card_collections', {
    params: q
  });

  return response.data;
}

export const fetchCollectionById = async (q) => {
  const response = await api.get(`/api/card_collections/${q}`);
  return response.data;
}

export const fetchCards = async (q) => {
  const response = await api.get(`/api/card_collections/${q}/cards`);
  return response.data;
}

export const fetchCollectionTags = async (q) => {
  const response = await api.get(`/api/card_collections/${q}/tags`);
  return response.data;
}

export const createCard = async (q, input) => {
  const response = await api.post(`/api/card_collections/${q}/cards`, input);
  return response.data;
}

export const deleteCard = async (q) => {
  const response = await api.delete(`/api/card_collections/${q}`);
  return response.data;
}


//review -  related to flashcards
export const fetchReviewBatch = async (payload) => {
  const response = await api.post(`/api/review`, payload);
  return response.data;
}

export const gradeCard = async (payload) => {
  const response = await api.put('/api/review/card', payload);
  return response.data;
}

export const fetchCardBatch = async (payload) => {
  const response = await api.post('/api/review/batch', payload);
  return response.data;
}

export const fetchDueCounts = async () => {
  const response = await api.get('/api/card_collections/cards/due');
  return response.data;
}


//updating usertags - related to flashcards
export const createTag = async (input) => {
  console.log(input)
  const response = await api.patch(`/api/user/tags`, input);
  return response.data;
}

export const fetchTags = async() => {
  const response = await api.get('/api/user/tags');
  return response.data;
}


export default api;