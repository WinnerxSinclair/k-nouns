<template>
  <div class="decks-view-root rel m0a">


    <button @click="modals.importDeck = true">Import Deck</button>

    <TransitionOverlay :show="modals.importDeck" @hide="modals.importDeck = false">
      <div>
        <form @submit.prevent="handleDeckImport" class="flex col import-form">
          <h2>Import from JSON</h2>
          <input type="file" accept=".json" id="fileInput" >
          <fieldset>
            <h3>Put New Cards Where?</h3>
            <div class="flex gap">
              <div class="flex gap-0">
                <input v-model="importDeckOption" id="newDeckOption" type="radio" name="importDeckOption" value="newDeck">
                <label for="newDeckOption">New Deck</label>
              </div>
              <div class="flex gap-0">
                <input v-model="importDeckOption" id="existingDeckOption" type="radio" name="importDeckOption" value="existingDeck">
                <label for="existingDeckOption">Existing Deck</label>
              </div>
            </div>
            <div v-if="importDeckOption" class="mt-3">
              <div v-if="importDeckOption === 'newDeck'">
                <div class="form-group">
                  <label for="">New Deck Name</label>
                  <input type="text" v-model="importDeckForm.newDeck">
                </div>
              </div>
              <div v-else>
                <div class="form-group">                  
                  <label for="deckSelect">Select A Deck</label>
                  <select name="deckSelect" id="deckSelect" class="deck-select" v-model="importDeckForm.existingDeck">    
                    <option 
                      v-for="deck in deckStore.decks" 
                      :key="deck._id"
                      :value="deck._id"
                    >
                      {{ deck.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

          </fieldset>
          <button>Import</button>
        </form>
      </div>
    </TransitionOverlay>
    <div>
      <div>Tag Mode: </div>
      <div class="flex gap">
        <button :class="{'selected-btn': tagMode === '$in'}" @click="setTagMode('$in')">OR</button>
        <button :class="{'selected-btn': tagMode === '$all'}" @click="setTagMode('$all')">AND</button>
      </div>
    </div>

    <div class="flex">      
      <button class="m0a block create-btn" @click="modals.addDeck = true">+ Create New Deck</button>
      <button class="m0a block create-btn" @click="modals.createTag = true">+ Create New Tag</button>
    </div>
    <TheHeader header="Dashboard" />

    <section>
      <h2 class="tac">Query</h2>
      <div class="flex jc">
        <div class="query-container">
          <h3>Decks</h3>
          <ul class="flex wrap gap">
            <li v-for="deck in selectedDecksIdNamePairs" :key="deck._id" class="query-li decks">
              <div>{{ deck.name }}</div>
              <button @click="removeFromQuery(deck._id, 'decks')">X</button>
            </li>
          </ul>
          <div class="spacer"></div>
          <h3>Tags</h3>
          <ul class="flex wrap gap">
            <li v-for="tag in selectedTagsArr" :key="tag" class="query-li tags">
              <div>
                {{ tag }}
              </div>
              <button @click="removeFromQuery(tag, 'tags')">X</button>
            </li>
          </ul>
        </div>
      </div>
    </section>
        

    <div class="filler-margin"></div>
    
    
    <div class="big-flex">
      <div class="scroll-container">
        
          <section v-if="deckStore.decks.length">
            <h2 >Decks</h2>
            <ul class="flex col gap-0">
              <li class="flex ac gap-1" v-for="deck in deckStore.decks" :key="deck._id">
                <div class="rel">                  
                  <button class="flex ac popupBtn" @click="openMiniEditDeckPopup(deck.name)">
                    <svg class="block" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/><path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16.77c0.68,0,1.23-0.56,1.23-1.23V8C22,6.9,21.1,6,20,6z M20,18L4,18V6h5.17l2,2H20V18z M18,12H6v-2h12V12z M14,16H6v-2h8V16z"/></g></svg>
                  </button>
                  <div class="abs deck-tag-controls editPopup" v-if="selectedDeckEdit === deck.name">
                    <h4>{{ `${deck.name}` }}</h4>
                    <hr>
                    <ul class="flex col gap">
                      <li>
                        <button @click="handleDeleteDeckClick(deck._id, deck.name)">Delete Deck</button>
                      </li>
                      <li>
                        <button @click="handleEditDeckClick(deck._id, deck.name)">Rename Deck</button>
                      </li>
                      <li>
                        <button @click="handleExportDeckClick(deck._id, deck.name)">Export Deck</button>
                      </li>
                    </ul>
                  </div>
                </div>
                <!-- <RouterLink :to="`/deck/${deck._id}`">abc</RouterLink> -->
                <button 
                  @click="addToQuery(deck._id, 'decks', $event)" 
                  class="name-btn"
                  :class="{ 'selected-query': querySets.decks.has(deck._id)}"
                >
                  {{ deck.name }}
                </button>
              </li>
            </ul>
          </section>
      

      
          <section v-if="deckStore.tags.length">
            <h2 >Tags</h2>
            <ul class="flex col gap-0">
              <li class="flex ac gap-1" v-for="tag in deckStore.tags" :key="tag">
                <div class="rel">                  
                  <button class="flex ac popupBtn" @click="openMiniEditTagPopup(tag)">
                    <svg class="block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="m21.41 11.58-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01 4 11V4h7v-.01l9 9-7 7.02z"/><circle cx="6.5" cy="6.5" r="1.5"/></svg>
                  </button>
                  <div class="abs deck-tag-controls editPopup" v-if="selectedTagEdit === tag">
                    <h4>{{ `${tag}` }}</h4>
                    <hr>
                    <ul class="flex col gap">
                      <li>
                        <button @click="handleDeleteTagClick(tag)">Delete Tag</button>
                      </li>
                      <li>
                        <button @click="handleEditTagClick(tag)">Rename Tag</button>
                      </li>
                    </ul>
                  </div>
                </div>
                <button 
                  @click="addToQuery(tag, 'tags', $event)" 
                  class="name-btn"
                  :class="{ 'selected-query': querySets.tags.has(tag)}"
                >
                  {{ tag }}
                </button>
              </li>
            </ul>
          </section>
        
      </div>
      
      
      <section class="table-pane">
        <h2 class="tac">Cards</h2>
        <ContentLoadedTransition> 
          <table v-if="cards.length">
            <thead>
              <tr>
                <th>
                  <input ref="master" type="checkbox" @change="handleMasterSwitch">
                </th>             
                <th>Front</th>
                <th>Back</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody >
              <tr v-for="card in cards" :key="card._id">            
                <td >
                  <div class="flex ac jc">
                    <input 
                      type="checkbox" 
                      :value="card._id"
                      v-model="selectedCards"
                    >
                  </div>
                </td>
              
                <td class="deck-name" >
                  <div class="clamp">
                    {{ card.front }}
                  </div>
                </td>
                <td class="deck-name">
                  <div class="clamp">{{ card.back }}</div>
                </td>
                <td @click="handleEditRoute(card._id)" >
                  <img src="../assets/pencil.png" alt="">
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="table-filler"></div>
        </ContentLoadedTransition>
        
      </section>
      <section>
        <h2>Controls</h2>
        <div class="flex col control-wrap gap">
          <button :disabled="!selectedCards.length" @click="modals.dueDate = true">Set Due Date</button>
          <button :disabled="!selectedCards.length" @click="modals.reset = true">Reset</button>
          <button :disabled="!selectedCards.length" @click="modals.addTag = true">Add Tag</button>
          <button :disabled="!selectedCards.length" @click="modals.removeTag = true">Remove Tag</button>
          <button :disabled="!selectedCards.length" @click="modals.delete = true">Delete</button>
        </div>
      </section>
    </div>

    <ModalForm
      label="Deck Name" 
      :show="modals.addDeck" 
      @submit="handleCreateDeck" 
      @hide="modals.addDeck = false" 
    />
    <ModalForm
      label="Tag" 
      :show="modals.createTag" 
      @submit="handleCreateTag" 
      @hide="modals.createTag = false" 
    />

    <ModalForm 
      @submit="handleUpdateDeckName" 
      @hide="modals.editDeckName = false" 
      :show="modals.editDeckName" 
      :prefill="deckName"
      label="Deck Name"
      btnText="Update Name" 
    />
    
    <ModalForm 
      @hide="modals.dueDate = false"
      :show="modals.dueDate"
      label="Set Due Date (0 = today)"
      btnText="Update"
      type="number"
      @submit="handleBulk('setDue', $event)"
      :lock="lock"
    />

    <ModalForm 
      @hide="modals.addTag = false"
      :show="modals.addTag"
      label="Add Tag to Card(s)"
      btnText="Add Tag"
      @submit="handleBulk('addTag', $event)"
      :lock="lock"
    />

    <ModalForm 
      @hide="modals.removeTag = false"
      :show="modals.removeTag"
      label="Remove Tag to Card(s)"
      btnText="Remove Tag"
      @submit="handleBulk('removeTag', $event)"
      :lock="lock"
    />

    <TransitionOverlay :show="modals.deleteDeck" @hide="modals.deleteDeck = false" :lock="lock">
      <Confirmation 
        @cancel="modals.deleteDeck = false"
        @confirm="handleDeckDelete" 
        heading="Confirm Deletion" 
        :message="`Delete deck '${deckName}' and all cards in it?`"
        :lock="lock" 
      />
    </TransitionOverlay>

    <TransitionOverlay :show="modals.exportDeck" @hide="modals.exportDeck = false" :lock="lock">
      <div>
        <div>{{ deckName }}</div>
        <button @click="handleExportJSONClick">Export as JSON</button>
        <button>Export as CSV</button>

        <label for="exportModeBackup">Backup</label>
        <input id="exportModeBackup" type="radio">
        <label for="exportModeShare">Share</label>
        <input id="exportModeShare" type="radio">
      </div>
    </TransitionOverlay>

    <ModalForm 
      @submit="handleUpdateTagName" 
      @hide="modals.editTagName = false" 
      :show="modals.editTagName" 
      :prefill="tag"
      label="Tag Name"
      btnText="Update Name"
      :lock="lock" 
    /> 

    <TransitionOverlay :show="modals.reset" @hide="modals.reset = false" :lock="lock">
      <Confirmation 
        @cancel="modals.reset = false"
        @confirm="handleBulk('reset')" 
        heading="Confirm Reset" 
        :message="`All card(s) progress will be reset.`"
        :lock="lock" 
      />
    </TransitionOverlay>

    <TransitionOverlay :show="modals.delete" @hide="modals.delete = false" :lock="lock">
      <Confirmation 
        @cancel="modals.delete = false"
        @confirm="handleBulk('delete')" 
        heading="Confirm Delete" 
        :message="`Selected Card(s) will be deleted permanently.`"
        :lock="lock"
        lock-message="Deleting Cards..." 
      />
    </TransitionOverlay>

    <TransitionOverlay :show="modals.deleteTag" @hide="modals.deleteTag = false" :lock="lock">
      <Confirmation 
        @cancel="modals.deleteTag = false"
        @confirm="handleTagDelete" 
        heading="Confirm Deletion" 
        :message="`Delete tag '${tag}'`" 
        :lock="lock"
      />
    </TransitionOverlay>
    
    <EditFlashcardView :cardId="cardId" v-if="cardId" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, useTemplateRef, watch, computed, onUnmounted } from 'vue'
import { createDeck, createTag, deleteDeck, 
         updateDeckName, updateTagName, deleteTag,
         importShare, getDashboardCards, bulkOps, exportDeck, importDeck 
       } from '../api/api.js';
import ModalForm from '../components/ModalForm.vue';
import TheHeader from '../components/TheHeader.vue'
import TransitionOverlay from '../components/TransitionOverlay.vue';
import EditFlashcardView from './EditFlashcardView.vue';
import Confirmation from '../components/alerts/Confirmation.vue';
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue'
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useDeckStore } from '../stores/deckStore.js';
import { useToastStore } from '../stores/toastStore.js';
const route = useRoute();
const router = useRouter();
const deckStore = useDeckStore();
const toastStore = useToastStore();
const modals = ref({
  addDeck: false,
  createTag: false,
  deleteDeck: false,
  editDeckName: false,
  deleteTag: false,
  editTagName: false,
  // importDeckFromCode: false,
  importDeck: false, // only JSON for now
  exportDeck: false,

  dueDate: false,
  reset: false,
  addTag: false,
  removeTag: false,
  delete: false,
  editCard: false
});
const deckName = ref('');
const deckId = ref(null);
const tag = ref('');
const isLoading = ref(true);
const submitting = ref(false);
const exportMode = ref('backup');
const cards = ref([]);
const cardId = ref(null);
const selectedCards = ref([]); //ids
const master = useTemplateRef('master');
const lock = ref(false);

const importDeckOption = ref(null);
const importDeckForm = ref({
  newDeck: null,
  existingDeck: null
})
let querySets = reactive({
  decks: new Set(),
  tags: new Set()
});

const selectedDecksIdNamePairs = computed(() => {
  return Array.from(querySets.decks).map((id) => ({
    _id: id,
    name: deckStore.constantDeckMap[id]
  }));
});
const selectedTagsArr = computed(() => {
  return Array.from(querySets.tags);
})
const tagMode = ref('$in');
function resetQuerySets(){
  querySets.decks.clear();
  querySets.tags.clear();
}
const cardIds = computed(() => cards.value.map((c) => c?._id));
watch(selectedCards, () => {
  const el = master.value;
  if (!el) return;                 // avoid “cannot set prop of null”
  if(!cards.value.length) return;
  el.checked       = selectedCards.value.length === cards.value.length;
  el.indeterminate = selectedCards.value.length &&
                     selectedCards.value.length < cards.value.length;
});

function resetModals(){
  for(let key of Object.keys(modals.value)){
    console.log(key);
    modals.value[key] = false;
  }
}
async function handleBulk(option, pl){ //setDue, addTag, removeTag, delete, reset
                    
  try{
    lock.value = true;
    if(!selectedCards.value.length) return;
    let selectCardSet = new Set(selectedCards.value);
    let pairIds = cards.value.filter((c) => selectCardSet.has(c._id))
                            .map((card) => card?.pairId)
                            .filter((pId) => pId !== undefined);
    
    let payload = { option, cardIds: [...selectedCards.value], pairIds };
    if(option === 'setDue') payload.due = pl;
    if(option == 'addTag' || option === 'removeTag') payload.tag = pl;
    // let x = new Promise(resolve => {
    //   setTimeout(() => resolve('xd'), 5000);
    // });
    // await x;
    await bulkOps(payload);
    resetModals();
    somethingChangedLetsFetchCards();
    if(option === 'addTag'){
      await deckStore.fetchTags(); //REFETCH???
      toastStore.createToast(`tag ${pl} added to cards success`);
    }else if(option === 'removeTag'){
      toastStore.createToast(`tag ${pl} removed from cards success`);
    }else if(option === 'setDue'){
      toastStore.createToast(`due date update success`);
    }else if(option === 'delete'){
      toastStore.createToast(`cards deleted success`);
    }
    else if(option === 'reset'){
      toastStore.createToast(`cards reset success`);
    }
    
    console.log('success');
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
} //REFACTOR???


async function handleExportJSONClick(){
  try{
    const exportedDeck = await exportDeck({ deckId: deckId.value, mode: exportMode.value });
    const url = URL.createObjectURL(exportedDeck);
    console.log(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deck-${deckId.value}.json`;
    a.click();
    URL.revokeObjectURL(url);
   
  }catch(err){
    console.error(err);
  }
}

watch(() => route.params.cardId, (id) => {
  if(id){
    cardId.value = id;
  }else{
    cardId.value = null;
  }
}, { immediate: true });

function handleEditRoute(id){

  router.push(`/card/${id}`);
  cardId.value = id;
}
function addToQuery(payload, set, e){
  if(!e.ctrlKey){
    resetQuerySets();
  }
  querySets[set].add(payload);
  somethingChangedLetsFetchCards();
}
function removeFromQuery(payload, set){
  console.log(payload);
  querySets[set].delete(payload);
  somethingChangedLetsFetchCards();
}
async function somethingChangedLetsFetchCards(){
  let deckArr = Array.from(querySets.decks);
  let tagArr = Array.from(querySets.tags);
  if(!deckArr.length && !tagArr.length){
    cards.value = [];
    selectedCards.value = [];
    return;
  } 
  try{
    cards.value = await getDashboardCards({ 
      decks: deckArr, 
      tags: tagArr,
      conditional: tagMode.value 
    });
    selectedCards.value = [];
    console.log(cards.value)
  }catch(err){
    console.error(err);
  }
}
function handleMasterSwitch(){
  let checked = master.value.checked;
  console.log(checked);
  if(checked){
    selectedCards.value = cardIds.value;
  }else{
    selectedCards.value = [];
  }
}
//name is obj
async function handleCreateDeck(name){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await createDeck({ name });
    await deckStore.fetchDecks();
    modals.value.addDeck = false;
    toastStore.createToast(`Deck ${name} Created`);
  }catch(err){
    console.log(err);
  }finally{
    submitting.value = false;
  }
}

function setTagMode(mode){
  tagMode.value = mode;
  somethingChangedLetsFetchCards();
}

function selectDeck(id, name){
  deckName.value = name;
  deckId.value = id;
}
function handleEditDeckClick(deckId, deckName){
  selectDeck(deckId, deckName);
  modals.value.editDeckName = true;
}
function handleDeleteDeckClick(deckId, deckName){
  selectDeck(deckId, deckName);
  modals.value.deleteDeck = true;
}
function handleExportDeckClick(id, name){
  console.log(id);
  selectDeck(id, name)
  modals.value.exportDeck = true;
}

function handleEditTagClick(tagName){
  tag.value = tagName;
  modals.value.editTagName = true;
}
function handleDeleteTagClick(tagName){
  tag.value = tagName;
  modals.value.deleteTag = true;
}


async function handleDeckImport(){
  const file = document.getElementById('fileInput')?.files[0];
  if(!file) return;
  
  const form = new FormData();
  form.append('file', file);
  if(!importDeckOption.value){
    return;
  }
  else if(importDeckOption.value === 'newDeck'){
    if(importDeckForm.value.newDeck === '') return;
    form.append('name', importDeckForm.value.newDeck);
  }else if(importDeckOption.value === 'existingDeck'){
    if(!importDeckForm.value.existingDeck) return;
    form.append('deckId', importDeckForm.value.existingDeck);
  }

  try{
    const res = await importDeck(form);
    console.log(res);
  }catch(err){
    console.error(err);
  }
}

async function handleDeckDelete(){
  if(lock.value) return;
  lock.value = true;
  try{
    await deleteDeck(deckId.value);
    await deckStore.fetchDecks();
    somethingChangedLetsFetchCards();
    console.log(deckId.value);
    querySets.decks.delete(deckId.value);
    toastStore.createToast(`Deck ${deckName.value} Deleted`);
    deckName.value = '';
    deckId.value = null;
    modals.value.deleteDeck = false;
    
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}
async function handleUpdateDeckName(name){
  if(lock.value) return;
  lock.value = true;
  try{
    await updateDeckName(deckId.value, { name });
    toastStore.createToast(`Name Change Success`);
    deckName.value = '';
    deckId.value = null;
    await deckStore.fetchDecks(); //DO I NEED TO REFETCH????
    modals.value.editDeckName = false;
  }catch(err){
    console.error(err);lock
  }finally{
    lock.value = false;
  }
}

async function handleUpdateTagName(newName){
  if(lock.value) return;
  lock.value = true;
  try{
    await updateTagName(tag.value, { newName });
    toastStore.createToast(`Name Change Success`);
    tag.value = '';
    await deckStore.fetchTags(); //MIGHT NOT NEED TO REFETCH
    modals.value.editTagName = false;
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}

async function handleTagDelete(){
  if(lock.value) return;
  lock.value = true;
  try{
    await deleteTag(tag.value);
    toastStore.createToast(`tag ${tag.value} deleted`);
    tag.value = '';
    await deckStore.fetchTags(); //REFETCH???
    modals.value.deleteTag = false;
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}

async function handleCreateTag(name){
  if(lock.value) return;
  lock.value = true;
  try{
    await createTag({ tagName: name });
    await deckStore.fetchTags(); //REFETCJ???
    modals.value.createTag = false;
    toastStore.createToast(`Tag ${name} Created`);
  }catch(err){
    console.log(err)
  }finally{
    lock.value = false;
  }
}


// async function handleImportDeckFromCode(_id){
//   if(submitting.value) return;
//   submitting.value = true;
//   try{
//     const x = await importShare({ _id });
//     console.log(x);
//   }catch(err){
//     console.error(err);
//   }finally{
//     submitting.value = false;
//   }
// }

//popup stuff
const selectedDeckEdit = ref(null);
const selectedTagEdit = ref(null);
function openMiniEditDeckPopup(deckName){
  selectedTagEdit.value = null;
  document.body.removeEventListener('click', handleBodyClick);
  selectedDeckEdit.value = deckName;
  document.body.addEventListener('click', handleBodyClick);
}
function openMiniEditTagPopup(tag){
  selectedDeckEdit.value = null;
  document.body.removeEventListener('click', handleBodyClick);
  selectedTagEdit.value = tag;
  document.body.addEventListener('click', handleBodyClick);
}

function handleBodyClick(e){
  console.log(e);
  if(e.target.closest('.popupBtn') || e.target.closest('.editPopup')){
    return;
  } 
  selectedTagEdit.value = null;
  selectedDeckEdit.value = null;
  document.body.removeEventListener('click', handleBodyClick);
}
onMounted(async () => {
  try{
    await Promise.all([
      deckStore.fetchDecks(),
      deckStore.fetchTags()
    ]);
    
  }catch(err){
    console.error(err);
  }finally{
    isLoading.value = false;
  }
});
onUnmounted(() => document.body.removeEventListener('click', handleBodyClick));
</script>






<style scoped>
.clamp{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
} 
button{
  padding: 0;
}
.query-container{
  width: clamp(350px, 100%, 70ch);
  background: white;
  padding: 1rem;
  border-radius: 1rem;
}
.scroll-container{
  flex: 0 1 260px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  overflow-y: auto;
}
.selected-btn{
  text-decoration: underline;
  text-decoration-color: brown;
  text-decoration-thickness: 3px;
}
.selected-query{
  background: rgb(253, 231, 143);
}
.import-form{
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  gap: 1rem;
  width: 300px;
}
.query-li{
  display: flex;
  gap: 1rem;
  padding: .2em .8em;
  border-radius: 9em;
}
.query-li.decks{
  background: rgb(253, 208, 124);
}
.deck-select{
  width: 250px;
}
.query-li.tags{
  background: rgb(153, 245, 153);
}
.deck-tag-controls{
  position: absolute;
  background: white;
  width: 150px;
  text-align: center;
  left: 27px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.185);
  z-index: 98;
  padding: .75rem;
  padding-bottom: 1rem;
}
.deck-tag-controls > h4{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.deck-tag-controls > ul{
  margin-top: 1rem;
}
.table-pane{
  min-height: 0;
  overflow: auto;
}
.control-wrap > button{
  padding: .2em .4em;
  background: white;
}
.name-btn{
  padding-left: .2rem;
    white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
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
  
  /* flex-flow: row wrap; */
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  gap: 2rem;
  
}
.spacer{
  width: 100%;
  background: black;
  height: 2px;
  margin-top: .2rem;
  margin-bottom: .2rem;
}
table{
  border-collapse: collapse;
  table-layout: auto;
  
  width: 500px;
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
.deck-name{
  max-width: 250px;
  min-width: 150px;

  word-wrap: break-word;
}
.deck-name-link{
  width: 100%;
  display: inline-block;
}
.deck-name-link:hover{
  background: rgb(245, 220, 137);
  transition: all .2s ease;
}
th, td{
  border: 1px solid #27272760;
  padding: .5rem;
}

.table-filler{
  width: 500px;
}
tr:nth-child(even){
  background: #c2c2c21c;
}
.decks-view-root{
  --custom-margin: 3rem;
  /* max-width: 1280px; */
  width: clamp(350px, 95%, 1280px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
}

ul{
  list-style:none;
  margin: 0;
}


.or-and-btn-group, .filler-margin{
  margin-top: var(--custom-margin);
}

</style>