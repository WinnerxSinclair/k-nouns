import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCard } from '../api/api.js';
export const useCardStore = defineStore('card', () => {
  const selectedCard = ref(null);

  function setCard(card){
    selectedCard.value = card;
  }

  function unsetCard(){
    selectedCard.value = null;
  }

  async function store_fetchCard(cardId){
    try{
      let res = await fetchCard(cardId);
      selectedCard.value = res;
    }catch(err){
      console.error(err);
    }
  }

  return{
    selectedCard,
    setCard,
    unsetCard,
    store_fetchCard
  }
});