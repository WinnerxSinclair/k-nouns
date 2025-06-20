<template>
  <div class="collections-view-root m0a">
    <TheHeader header="Dashboard" />
    <div class="flex">      
      <button class="m0a block" @click="modals.addCollection = true">+ Create New Collection</button>
      <button class="m0a block" @click="modals.addTag = true">+ Create New Tag</button>
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
    <table>

      <thead>
        <tr>
          <th>Collections</th>
          <th >Edit</th>
          <th >Del.</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="collection in collectionStore.collections" :key="collection._id">
          <td class="col-name" scope="row">
            <RouterLink :to="`/collection/${collection._id}`" @click="collectionStore.setIdName(collection._id, collection.name)">
              {{ collection.name }}
            </RouterLink>
          </td>
          <td class="td-c">
            <button @click="handleEditColClick(collection._id, collection.name)">
              <img src="../assets/pencil.png" alt="">
            </button>
          </td>
          <td class="td-c">
            <button @click="handleDeleteColClick(collection._id, collection.name)">
              <img src="../assets/delete.png" alt="">
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <ModalForm
      label="Collection Name" 
      :show="modals.addCollection" 
      @submit="handleCreateCollection" 
      @hide="modals.addCollection = false" 
    />
    <ModalForm
      label="Tag" 
      :show="modals.addTag" 
      @submit="handleCreateTag" 
      @hide="modals.addTag = false" 
    />
    <ModalForm 
      @submit="handleUpdateColName" 
      @hide="modals.editColName = false" 
      :show="modals.editColName" 
      :prefill="collectionName"
      btnText="Update Name" 
    /> 

    <TransitionOverlay :show="modals.deleteCol" @hide="modals.deleteCol = false">
      <Confirmation 
        @cancel="modals.deleteCol = false"
        @confirm="handleCollectionDelete" 
        heading="Confirm Deletion" 
        :message="`Delete collection ${collectionName} and all cards in it?`" 
      />
    </TransitionOverlay>

      
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createCardGroup, createTag, deleteCollection, updateCollectionName } from '../api/api.js';
import ModalForm from '../components/ModalForm.vue';
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue';
import TheHeader from '../components/TheHeader.vue'
import TransitionOverlay from '../components/TransitionOverlay.vue';
import Confirmation from '../components/alerts/Confirmation.vue';
import { RouterLink } from 'vue-router';
import { useCollectionStore } from '../stores/collectionStore.js';
import { useToastStore } from '../stores/toastStore.js';
const collectionStore = useCollectionStore();
const toastStore = useToastStore();
const modals = ref({
  addCollection: false,
  addTag: false,
  deleteCol: false,
  editColName: false
});
const collectionName = ref('');
const collectionId = ref(null);
const isLoading = ref(true);
const submitting = ref(false);

//name is obj
async function handleCreateCollection(name){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await createCardGroup({ name });
    await collectionStore.store_fetchCollections();
    modals.value.addCollection = false;
    toastStore.createToast(`Collection ${name} Created`);
  }catch(err){
    console.log(err);
  }finally{
    submitting.value = false;
  }
}

function selectCol(colId, colName){
  collectionName.value = colName;
  collectionId.value = colId;
}
function handleEditColClick(colId, colName){
  selectCol(colId, colName);
  modals.value.editColName = true;
}
function handleDeleteColClick(colId, colName){
  selectCol(colId, colName);
  modals.value.deleteCol = true;
}

async function handleCollectionDelete(){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await deleteCollection(collectionId.value);
    collectionName.value = '';
    collectionId.value = null;
    await collectionStore.store_fetchCollections();
    modals.value.deleteCol = false;
  }catch(err){
    console.error(err);
  }finally{
    submitting.value = false;
  }
}
async function handleUpdateColName(name){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await updateCollectionName(collectionId.value, { name });
    collectionName.value = '';
    collectionId.value = null;
    await collectionStore.store_fetchCollections();
    modals.value.editColName = false;
  }catch(err){
    console.error(err);
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
    modals.value.addTag = false;
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
  }catch(err){
    console.error(err);
  }finally{
    isLoading.value = false;
  }
});
</script>

<style scoped>
table{
  border-collapse: collapse;
  table-layout: auto;
}
img{
  width: 24px;
}
.td-c{
  text-align:center;
  vertical-align: middle;
}
td > button{
  display: flex;
  justify-content: center;
  align-items: center;
}
.col-name{
  max-width: 250px;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  word-wrap: break-word;
}
th, td{
  border: 1px solid #27272760;
  border-left: none;
  border-right: none;
  border-top: none;
  padding: .5rem;
}
tr:nth-child(even){
  background: #f8e1945d;
}
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