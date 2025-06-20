import { defineStore } from "pinia";
import { ref, computed } from 'vue'
import { getTags, getCollectionTags, getCollections, getCollectionById } from "../api/api";
export const useCollectionStore = defineStore('collection', () => {
  const tags = ref([]);
  const colTags = ref([]);
  const collections = ref([]);
  const collectionMap = ref({});

  function getColName(id){
    return collectionMap[id];
  }

  function setIdName(id, name){
    collectionMap.value[id] = name;
  }
  const collectionsIds = computed(() => collections.value.map((col) => col._id));
  const tagNames = computed(() => tags.value.map((tag) => tag.name));

  const queryConditional = ref('$or');

  async function fetchCollectionById(id){
    try{
      const response = await getCollectionById(id);
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

  async function fetchCollectionTags(q){
    try{
      const response = await getCollectionTags(q);
      colTags.value = response;
    }catch(err){
      console.error('error getting collection tags', err);
    }
  }

  async function fetchCollections(){ 
    try{
      const response = await getCollections();
      collections.value = response;
    }catch(err){
      console.error(err);
    }
  }


  //study view
  const selectedFilters = ref({
    collections: [],
    tags: []
  });
  const selectedCollections = computed(() => new Set(selectedFilters.value.collections));
  const selectedTags = computed(() => new Set(selectedFilters.value.tags));
  const somethingSelected = computed(() => selectedFilters.value.collections.length > 0 || 
                                           selectedFilters.value.tags.length > 0);
  function selectAllCollections(){
    selectedFilters.value.collections = [...collectionsIds.value];
  }
  function selectAllTags(){
    selectedFilters.value.tags = [...tagNames.value];
  }
  function deselectAll(name){
    selectedFilters.value[name] = [];
  }
  function setInitialSelected(colKeys, tags){
    selectedFilters.value.collections = colKeys;
    selectedFilters.value.tags = tags;
  }



  return {
    tags,
    collections, 
    colTags,
    selectedFilters,
    queryConditional,
    somethingSelected,
   
   
    collectionMap,
    selectedCollections,
    selectedTags,

    setIdName,
    getColName,
    fetchTags, 
    fetchCollectionTags,
    fetchCollections,
    fetchCollectionById,
    selectAllCollections,
    selectAllTags,
    deselectAll,
    setInitialSelected
  } 
})