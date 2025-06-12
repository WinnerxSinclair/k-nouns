<template>
  <div class="collections-view-root m0a">
    <div class="flex">      
      <button class="m0a block" @click="showForm.collection = true">+ Create New Collection</button>
      <button class="m0a block" @click="showForm.tag = true">+ Create New Tag</button>
    </div>
          

    <div class="filler-margin"></div>
    
    <div class="test-grid ">
      
        <div v-if="collectionStore.collections.length">
          <h2 class="tac">Collections</h2>
          <ContentLoadedTransition>
            <div v-show="!isLoading">
              <ul class="flex col ac opacity">
                <li class="flex ac mt-3" v-for="collection in collectionStore.collections" :key="collection._id">
                  <RouterLink
                    @click="collectionStore.setIdName(collection._id, collection.name)"
                    class="collection tac" 
                    :to="`/collection/${collection._id}`"
                  >
                    {{ collection.name }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </ContentLoadedTransition>
        </div>
      

      <div v-if="collectionStore.tags.length">
        <h2 class="tac">Tags</h2>
        <ContentLoadedTransition>
          <div v-show="!isLoading">        
            <ul class="flex col ac">
              <li class="flex ac mt-3" v-for="tag in collectionStore.tags" :key="tag">
                <div class="tags tac">{{ tag }}</div>
              </li>      
            </ul>
          </div>
        </ContentLoadedTransition>
      </div>
    </div>       
  </div>

  <ModalForm
    label="Collection Name" 
    :show="showForm.collection" 
    @submit="handleCreateCollection" 
    @hide="showForm.collection = false" 
  />

  <ModalForm
    label="Tag" 
    :show="showForm.tag" 
    @submit="handleCreateTag" 
    @hide="showForm.tag = false" 
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createCardGroup, createTag } from '../api/api.js';
import ModalForm from '../components/ModalForm.vue';
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue';
import { RouterLink } from 'vue-router';
import { useCollectionStore } from '../stores/collectionStore.js';
import { useToastStore } from '../stores/toastStore.js';
const collectionStore = useCollectionStore();
const toastStore = useToastStore();
const showForm = ref({
  collection: false,
  tag: false
});
const isLoading = ref(true);
const submitting = ref(false);

//name is obj
async function handleCreateCollection(name){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await createCardGroup({ name });
    await collectionStore.store_fetchCollections();
    showForm.value.collection = false;
    toastStore.createToast(`Collection ${name} Created`);
  }catch(err){
    console.log(err);
  }finally{
    submitting.value = false;
  }
}

async function handleCreateTag(name){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await createTag({ tagName: name });
    await collectionStore.store_fetchTags();
    showForm.value.tag = false;
    toastStore.createToast(`Tag ${name} Created`);
  }catch(err){
    console.log(err)
  }finally{
    submitting.value = false;
  }
}



onMounted(async () => {
  try{

    await collectionStore.store_fetchCollections();
    await collectionStore.store_fetchTags();
    let x = new Promise(resolve => {
      setTimeout(() => resolve('xd'), 500);
    })
    await x;
    isLoading.value = false;
  }catch(err){
    console.error(err);
  }
});
</script>

<style scoped>
.collections-view-root{
  --custom-margin: 3rem;
  max-width: 1280px;
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
}
.tags{
  background: rgb(129, 223, 129);
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
  color: var(--text-color);
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