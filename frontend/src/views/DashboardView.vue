<template>
  <div class="collections-view-root m0a">
    <TheHeader header="Dashboard" />
    <div class="flex">      
      <button class="m0a block create-btn" @click="modals.addCollection = true">+ Create New Collection</button>
      <button class="m0a block create-btn" @click="modals.addTag = true">+ Create New Tag</button>
    </div>
          

    <div class="filler-margin"></div>
    
    <div class="big-flex">
      
        <div v-if="collectionStore.collections.length">
          <h2 class="tac">Collections</h2>
          <ContentLoadedTransition>
            <div v-show="!isLoading">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Collection</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Del.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="collection in collectionStore.collections" :key="collection._id">
                    <td class="col-name">
                      <RouterLink
                        class="col-name-link" 
                        :to="`/collection/${collection._id}`" 
                        @click="collectionStore.setIdName(collection._id, collection.name)"
                      >
                        {{ collection.name }}
                      </RouterLink>
                    </td>
                    <td class="td-c">
                      <button 
                        :aria-label="`Edit collection name: ${collection.name}`" 
                        @click="handleEditColClick(collection._id, collection.name)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" 
                          height="24px" 
                          viewBox="0 0 24 24" 
                          width="24px" 
                          fill="#000000"
                        >
                          <path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </button>
                    </td>
                    <td class="td-c">
                      <button 
                        :aria-label="`Delete collection: ${collection.name}`"
                        @click="handleDeleteColClick(collection._id, collection.name)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ContentLoadedTransition>
        </div>
      

      <div v-if="collectionStore.tags.length">
        <h2 class="tac">Tags</h2>
        <ContentLoadedTransition>
          <div v-show="!isLoading">        
            <table>
              <thead>
                <tr>
                  <th scope="col">Tag</th>
                  <th scope="col">Edit</th>
                  <th scope="col">Del.</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tag in collectionStore.tags" :key="tag">
                  <td class="col-name">{{ tag }}</td>
                  <td class="td-c">
                    <button :aria-label="`Edit tag name: ${tag}`" @click="handleEditTagClick(tag)">                   
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        height="24px" 
                        viewBox="0 0 24 24" 
                        width="24px" 
                        fill="#000000"
                      >
                        <path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </button>
                  </td>
                  <td class="td-c">
                    <button :aria-label="`Delete tag: ${tag}`" @click="handleDeleteTagClick(tag)">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ContentLoadedTransition>
      </div>

    </div>

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
      label="Collection Name"
      btnText="Update Name" 
    /> 

    <TransitionOverlay :show="modals.deleteCol" @hide="modals.deleteCol = false">
      <Confirmation 
        @cancel="modals.deleteCol = false"
        @confirm="handleCollectionDelete" 
        heading="Confirm Deletion" 
        :message="`Delete collection '${collectionName}' and all cards in it?`" 
      />
    </TransitionOverlay>

    <ModalForm 
      @submit="handleUpdateTagName" 
      @hide="modals.editTagName = false" 
      :show="modals.editTagName" 
      :prefill="tag"
      label="Tag Name"
      btnText="Update Name" 
    /> 

    <TransitionOverlay :show="modals.deleteTag" @hide="modals.deleteTag = false">
      <Confirmation 
        @cancel="modals.deleteTag = false"
        @confirm="handleTagDelete" 
        heading="Confirm Deletion" 
        :message="`Delete tag '${tag}'`" 
      />
    </TransitionOverlay>     
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createCardGroup, createTag, deleteCollection, 
         updateCollectionName, updateTagName, deleteTag 
       } from '../api/api.js';
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
  editColName: false,
  deleteTag: false,
  editTagName: false
});
const collectionName = ref('');
const collectionId = ref(null);
const tag = ref('');
const isLoading = ref(true);
const submitting = ref(false);

//name is obj
async function handleCreateCollection(name){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await createCardGroup({ name });
    await collectionStore.fetchCollections();
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

function handleEditTagClick(tagName){
  tag.value = tagName;
  modals.value.editTagName = true;
}
function handleDeleteTagClick(tagName){
  tag.value = tagName;
  modals.value.deleteTag = true;
}

async function handleCollectionDelete(){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await deleteCollection(collectionId.value);
    collectionName.value = '';
    collectionId.value = null;
    await collectionStore.fetchCollections();
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
    await collectionStore.fetchCollections();
    modals.value.editColName = false;
  }catch(err){
    console.error(err);
  }finally{
    submitting.value = false;
  }
}

async function handleUpdateTagName(newName){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await updateTagName(tag.value, { newName });
    tag.value = '';
    await collectionStore.fetchTags();
    modals.value.editTagName = false;
  }catch(err){
    console.error(err);
  }finally{
    submitting.value = false;
  }
}

async function handleTagDelete(){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await deleteTag(tag.value);
    tag.value = '';
    await collectionStore.fetchTags();
    modals.value.deleteTag = false;
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
    await collectionStore.fetchTags();
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
    await Promise.all([
      collectionStore.fetchCollections(),
      collectionStore.fetchTags()
    ]);
  }catch(err){
    console.error(err);
  }finally{
    isLoading.value = false;
  }
});
</script>

<style scoped>
.create-btn{
  border-radius: 9em;
  border: 1px solid rgba(241, 200, 142, 0.034);
  border-bottom: 2px solid rgba(241, 199, 142, 0.61);
  cursor: pointer;
  padding: .2em .8em;
  background: rgba(253, 240, 217, 0.486);
}
.big-flex{
  display: flex;
  gap: 5rem 12rem;
  flex-flow: row wrap;
  justify-content: center;
}
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
  min-width: 150px;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  word-wrap: break-word;
}
.col-name-link{
  width: 100%;
  display: inline-block;
}
.col-name-link:hover{
  background: rgb(245, 220, 137);
  transition: all .2s ease;
}
th, td{
  border-bottom: 1px solid #27272760;
  padding: .5rem;
}
th:is(:first-child){
  text-align: left;
}
tr:nth-child(even){
  background: #c2c2c233;
}
.collections-view-root{
  --custom-margin: 3rem;
  max-width: 1280px;
}

ul{
  list-style:none;
  margin: 0;
}
.selected-btn{
  background: rgb(98, 112, 196);
}

.or-and-btn-group, .filler-margin{
  margin-top: var(--custom-margin);
}

</style>