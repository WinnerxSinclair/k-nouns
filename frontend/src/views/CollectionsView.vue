<template>
  <div class="collections-view-root">
    
    <div class="tac">
      <ContentLoadedTransition>
        <div v-if="!isLoading" class="flex ac jc gap">
          <p  class="fs-500">{{ countInfo?.totalDue }}</p>
          <img class="icon" src="../assets/cards.png" alt="">
        </div>
      </ContentLoadedTransition>

      <div v-if="isLoading" class="placeholder-1"></div>
      <RouterLink :class="{'disabled': isLoading || !collectionStore.somethingSelected}" class="study-btn" to="/review">
        {{ isLoading ? 'Loading...' : 'Study Due Cards' }}
      </RouterLink>

      <p v-if="!collectionStore.tagOrColExists && !isLoading">Nothing Exists, create collections and cards in the Dashboard</p> 
    </div>
                     
    <div v-if="collectionStore.tagAndColExists" class="flex ac jc or-and-btn-group" >
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
    
    <div class="test-grid">
      <ContentLoadedTransition>
      <div v-if="collectionStore.collections.length">
        <h2 class="tac">Collections</h2>
        <ContentLoadedTransition>
          <div v-show="!isLoading">
            <div>          
              <button @click="collectionStore.selectAllCollections">Select All</button>
              <button @click="collectionStore.deselectAll('collections')">Deselect All</button>
            </div>       
            <ul class="flex col ac opacity">
              <li class="flex ac mt-3 gap" v-for="collection in collectionStore.collections" :key="collection._id">
                <label 
                  class="collection tac"
                  :class="{'selected': collectionStore.selectedCollections.has(collection._id)}"
                  :for="collection._id"
                >
                  {{ collection.name }}
                </label>
                <img v-if="countInfo && collection._id in countInfo?.byCollection" class="icon" src="../assets/cards.png" alt="">
                <p v-else class="icon"></p>
                <input 
                  type="checkbox" 
                  :value="collection._id" 
                  v-model="collectionStore.selectedFilters.collections"
                  :id="collection._id"
                > 
              </li>
            </ul>
          </div>
        </ContentLoadedTransition>
      </div>
      </ContentLoadedTransition>

      <div v-if="collectionStore.tags.length">
        <h2 class="tac">Tags</h2>
        <ContentLoadedTransition>
          <div v-show="!isLoading">
            <div>          
              <button @click="collectionStore.selectAllTags">Select All</button>
              <button @click="collectionStore.deselectAll('tags')">Deselect All</button>
            </div>        
            <ul class="flex col ac">
              <li class="flex ac mt-3 gap" v-for="tag in collectionStore.tags" :key="tag">
                <label 
                  class="tags tac" 
                  :class="{'selected': collectionStore.selectedTags.has(tag)}"
                  :for="tag"
                >
                  {{ tag }}
                </label>
                <img v-if="tagSet && tagSet.has(tag)" class="icon" src="../assets/cards.png" alt="">
                <p v-else class="icon"></p>
                <input type="checkbox" :id="tag" :value="tag" v-model="collectionStore.selectedFilters.tags">
              </li>      
            </ul>
          </div>
        </ContentLoadedTransition>
      </div>
    </div>     
  </div>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue';
import { RouterLink } from 'vue-router';
import { useCollectionStore } from '../stores/collectionStore.js';
import { fetchDueCounts } from '../api/api.js';

const collectionStore = useCollectionStore();
const isLoading = ref(true);
const tagSet = ref(null);
const countInfo = ref(null);


onMounted(async () => {
  try{
    await collectionStore.store_fetchCollections();
    
    await collectionStore.store_fetchTags();
    countInfo.value = await fetchDueCounts();

    let keys = new Set(Object.keys(countInfo.value.byCollection));
    collectionStore.setInitialSelected(keys, countInfo.value.tagsWithDue)
    collectionStore.sortCollections(keys);
    tagSet.value = new Set(countInfo.value.tagsWithDue);

    collectionStore.sortTags(tagSet.value);
    let x = new Promise(resolve => {
      setTimeout(() => resolve('xd'), 1000);
    });
    await x;
    isLoading.value = false;
  }catch(err){
    console.error(err);
  }
});
</script>

<style scoped>
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

.collection, .tags{
  width: 150px;
  max-width: 150px;
  word-wrap: break-word;
  background: rgb(255, 190, 69);
  border-radius: 1rem;
  padding: .2em .5em;
  display: block;
  cursor: pointer;
  text-decoration: none;
  color: var(--text-color);
  opacity: 50%;
  user-select: none;
}
.selected{
  opacity: 1;
  outline: 1px solid rgba(0, 0, 0, 0.411);
}
.tags{
  background: rgb(129, 223, 129);
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
  background: rgb(98, 112, 196);
}
.study-btn{
  text-decoration: none;
  padding: .5em 1em;
  font-size: 1.2rem;
  background: var(--btn-bg-pop);
  color: var(--btn-color-pop);
  border-radius: 9999px;
  border-bottom: 3px solid black;
  display: inline-block;
  margin-top: 2rem;
  margin-bottom: 1rem;
  transition: opacity 1s ease;
}
.or-and-btn-group, .filler-margin{
  margin-top: var(--custom-margin);
}

</style>