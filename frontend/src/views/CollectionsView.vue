<template>
  <div class="collections-view-root">
    
    <div class="tac">
      <ContentLoadedTransition>
        <div v-if="!isLoading" class="flex ac jc gap">
          <p  class="fs-500">{{ totalDue }}</p>
          <img class="icon" src="../assets/cards.png" alt="">
        </div>
      </ContentLoadedTransition>

      <div v-if="isLoading" class="placeholder-1"></div>
      <RouterLink 
        :class="{'disabled': isLoading || !collectionStore.somethingSelected}" 
        class="study-btn btn-main" 
        to="/review"
      >
        {{ isLoading ? 'Loading...' : 'Study Due Cards' }}
      </RouterLink>

      <p v-if="!oneExists && !isLoading">Nothing Exists, create collections and cards in the Dashboard</p> 
    </div>
    
    <ContentLoadedTransition>
      <div v-if="bothExist" class="flex ac jc or-and-btn-group" >
        <button 
          @click="collectionStore.queryConditional = '$or'"
          :class="{'selected-btn': collectionStore.queryConditional === '$or'}"      
        >
          OR
        </button>
        <button 
          @click="collectionStore.queryConditional = '$and'"
          :class="{'selected-btn': collectionStore.queryConditional === '$and'}"
        >
          AND
        </button>      
      </div>
      <div v-else class="filler-margin"></div>
    </ContentLoadedTransition>

    

    <ContentLoadedTransition>
      <div v-if="!isLoading" class="ul-container">
        <fieldset>
          <div class="flex jc all-none-btn-wrapper">
            <button @click="collectionStore.selectAllCollections">All</button>
            <button @click="collectionStore.deselectAll('collections')">None</button>
          </div>
          <ul class="label-list">
            <li>
              <h4 class="fs-500 bold">Collections</h4>
              <h4 class="fs-500 bold">Due</h4>
            </li>
            <hr>
            <li 
              v-for="collection in collections" 
              :key="collection._id"
              :class="{'selected': collectionStore.selectedCollections.has(collection._id)}"
            >
              <input 
                type="checkbox" 
                :value="collection._id" 
                v-model="collectionStore.selectedFilters.collections"
                :id="collection._id"
              >
              <label class="label-row" :for="collection._id">
                <span>{{ collection.name }}</span>
                <span>{{ collection.dueCount }}</span>
              </label>          
            </li>
          </ul>
        </fieldset>

        <fieldset>
          <div class="flex jc all-none-btn-wrapper">
            <button @click="collectionStore.selectAllTags">All</button>
            <button @click="collectionStore.deselectAll('tags')">None</button>
          </div>
          <ul class="label-list">
            <li>
              <h4 class="fs-500 bold">Tags</h4>
              <h4 class="fs-500 bold">Due</h4>
            </li>
            <hr>
            <li 
              v-for="tag in tags" 
              :key="tag.name"
              :class="{'selected': collectionStore.selectedTags.has(tag.name)}"
            >
                              
              <input 
                type="checkbox" 
                :value="tag.name" 
                v-model="collectionStore.selectedFilters.tags"
                :id="tag.name"
              >
              <label class="label-row" :for="tag.name">
                <span>{{ tag.name }}</span>
                <span>{{ tag.dueCount }}</span>
              </label> 
            </li>
          </ul>
        </fieldset>
      </div>
    </ContentLoadedTransition>
  </div>

</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue';
import { RouterLink } from 'vue-router';
import { useCollectionStore } from '../stores/collectionStore.js';
import { fetchDueCounts } from '../api/api.js';

const collectionStore = useCollectionStore();
const isLoading = ref(true);
let countInfo = ref(null);
let collections = computed(() => countInfo.value?.collections ?? []);
let tags = computed(() => countInfo.value?.tags ?? []);
let totalDue = computed(() => countInfo.value?.totalDue ?? 0);
let bothExist = computed(() => collections.value.length && tags.value.length);
let oneExists = computed(() => collections.value.length || tags.value.length);

onMounted(async () => {
  try{
    countInfo.value = await fetchDueCounts();
    console.log(countInfo.value)
    collectionStore.collections = countInfo.value.collections;
    collectionStore.tags = countInfo.value.tags; 
    collectionStore.setInitialSelected(countInfo.value.colsWithDueCards, countInfo.value.tagsWithDueCards);
    isLoading.value = false;
  }catch(err){
    console.error(err);
  }
});
</script>

<style scoped>

.all-none-btn-wrapper > button,
.or-and-btn-group > button{
  font-size:inherit;
  font-family: inherit;
  font-weight: inherit;
  cursor: pointer;
}
.or-and-btn-group > button:hover{
  text-decoration: underline;
  text-decoration-color: brown;  
}
.all-none-btn-wrapper{
  gap: 2rem;
}

.ul-container{
  display: flex;
  gap: 5rem 12rem;
  flex-flow: row wrap;
  justify-content: center;
}
.label-list > li{
  display:flex;
  margin-top: .9rem;
}

.label-list > :first-child > :first-child,
label > span:is(:first-child){
  width: 200px;
}
.label-list > li:is(:first-child){
  padding: .3rem 1rem;
}
.label-list > li:not(:first-child){
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  border-radius: 9999px;
  user-select: none;
  font-size: 1.2rem;
}

.selected{
  background: hsla(15, 56%, 52%, 0.173);
}
.label-list > li:not(:first-child):not(.selected):hover{
  background: hsla(0, 0%, 81%, 0.173);
}
.label-row{
  display:flex;

  padding: .3rem 1rem;
  width: 100%;
}

.placeholder-1{
  height: 30px;
  width: 1px;
}

.icon{
  width: 25px;
  height: 25px;
}

input[type="checkbox"]{
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  white-space: nowrap;
  border: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.collections-view-root{
  --custom-margin: 3rem;
}

.test-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(50ch, 1fr));
  justify-items: center;
  gap: 2rem 0;
}


form{
  padding: 2rem;
  background:white;
  border-radius: 1rem;
}
ul{
  list-style:none;
  margin: 0;
}
.selected-btn{
  text-decoration: underline;
  text-decoration-color: brown;
}
.study-btn{
  text-decoration: none;
  padding: .5em 1em;
  font-size: 1.2rem;
  border-radius: 9999px;
  display: inline-block;
  margin-top: 2rem;
  margin-bottom: 1rem;
  transition: opacity 1s ease;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  user-select: none;
}

button:not(.study-btn){
  font-family:'Courier New', Courier, monospace;
}
.or-and-btn-group, .filler-margin{
  margin-top: var(--custom-margin);
  gap: 2rem;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

</style>