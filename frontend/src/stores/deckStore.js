import { defineStore } from "pinia";
import { ref, computed } from 'vue'
import { getTags, getDeckTags, getDecks, getDeckById } from "../api/api";
export const useDeckStore = defineStore('deck', () => {
  const tags = ref([]);
  const deckTags = ref([]);
  const decks = ref([]);
  const deckMap = ref({});

  function getDeckName(id){
    return deckMap[id];
  }

  function setIdName(id, name){
    deckMap.value[id] = name;
  }
  const decksIds = computed(() => decks.value.map((deck) => deck._id));

  const constantDeckMap = computed(() => {
    return decks.value.reduce((acc, cur) => {
      acc[cur._id] = cur.name;
      return acc;
    }, {})
  });

  const tagNames = computed(() => tags.value.map((tag) => tag.name));

  const queryConditional = ref('$and');

  async function fetchDeckById(id){
    try{
      const response = await getDeckById(id);
      return response.name;
    }catch(err){
      console.error(err);
    }
  }

  async function fetchTags(){
    try{
      const response = await getTags();
      tags.value = response;
    }catch(err){
      console.error('error getting tags', err);
    }
  }

  async function fetchDeckTags(q){
    try{
      const response = await getDeckTags(q);
      deckTags.value = response;
    }catch(err){
      console.error('error getting deck tags', err);
    }
  }

  async function fetchDecks(){ 
    try{
      const response = await getDecks();
      decks.value = response;
    }catch(err){
      console.error(err);
    }
  }


  //study view
  const selectedFilters = ref({
    decks: [],
    tags: []
  });
  const selectedDecks = computed(() => new Set(selectedFilters.value.decks));
  const selectedTags = computed(() => new Set(selectedFilters.value.tags));
  const somethingSelected = computed(() => selectedFilters.value.decks.length > 0 || 
                                           selectedFilters.value.tags.length > 0);
  function selectAllDecks(deckIds){
    selectedFilters.value.decks = [...deckIds];
  }
  function selectAllTags(tags){
    selectedFilters.value.tags = [...tags];
  }
  function deselectAll(name){
    selectedFilters.value[name] = [];
  }
  function setInitialSelected(deckKeys, tags){
    selectedFilters.value.decks = deckKeys;
    selectedFilters.value.tags = tags;
  }




  return {
    tags,
    decks, 
    deckTags,
    selectedFilters,
    queryConditional,
    somethingSelected,
   
   
    deckMap,
    selectedDecks,
    selectedTags,
    constantDeckMap,

    setIdName,
    getDeckName,
    fetchTags, 
    fetchDeckTags,
    fetchDecks,
    fetchDeckById,
    selectAllDecks,
    selectAllTags,
    deselectAll,
    setInitialSelected,
  
  } 
})