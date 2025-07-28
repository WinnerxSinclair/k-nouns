<template>
  <div class="decks-view-root rel m0a">


    <!-- <button @click="modals.importDeck = true">Import Deck</button> -->

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
    <!-- <div>
      <div>Tag Mode: </div>
      <div class="flex gap">
        <button :class="{'selected-btn': tagMode === '$in'}" @click="setTagMode('$in')">OR</button>
        <button :class="{'selected-btn': tagMode === '$all'}" @click="setTagMode('$all')">AND</button>
      </div>
    </div> -->

    <!-- <TheHeader header="Dashboard" /> -->
    <h1 class="tac dashboard-heading">Dashboard</h1>

    <section class="desktop-query">
      <button 
        class="btn-main big-btn m0a query-btn"
        :class="{'visual-disable': !newQuery}" 
        @click="handleQueryClick"
      >
        {{ querying ? 'Fetching...' : 'Query' }}
      </button>
      <div class="flex jc">
        <div class="query-container">
          <h3>Decks</h3>
          <ul class="flex wrap gap">
            <li v-for="deck in selectedDecksIdNamePairs" :key="deck._id" class="query-li decks">    
              <button @click="removeFromQuery(deck._id, 'decks')">{{ deck.name }}</button>   
            </li>
          </ul>
          <div class="spacer"></div>
          <h3>Tags</h3>
          <ul class="flex wrap gap">
            <li v-for="tag in selectedTagsArr" :key="tag" class="query-li tags">
              <button @click="removeFromQuery(tag, 'tags')">{{ tag }}</button>
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
                  <button class="flex ac popupBtn pad-0" @click="openMiniEditDeckPopup(deck.name)">
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
                      <!-- <li>
                        <button @click="handleExportDeckClick(deck._id, deck.name)">Export Deck</button>
                      </li> -->
                    </ul>
                  </div>
                </div>
                <!-- <RouterLink :to="`/deck/${deck._id}`">abc</RouterLink> -->
                <button
                  @keydown.enter.prevent="addToQuery(deck._id, 'decks', $event)" 
                  @click="addToQuery(deck._id, 'decks', $event)"
                   
                  class="name-btn"
                  :class="{ 'selected-query-deck': querySets.decks.has(deck._id)}"
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
                  <button class="flex ac popupBtn pad-0" @click="openMiniEditTagPopup(tag)">
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
                  @keydown.enter.prevent="addToQuery(tag, 'tags', $event)"  
                  @click="addToQuery(tag, 'tags', $event)" 
                  class="name-btn"
                  :class="{ 'selected-query-tag': querySets.tags.has(tag)}"
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
            <colgroup>
              <col style="width:3rem">      <!-- checkbox -->
              <col class="front-col">       <!-- Front -->
              <col class="back-col">        <!-- Back -->
              <col style="width:4rem">      <!-- Edit icon -->
            </colgroup>
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
          
        </ContentLoadedTransition>
        
      </section>
      <section class="control-section">
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


    <!-- MOBILE START -->
    <div class="mobile-root">
       <section v-if="!showCardTable">
          <button 
            class="btn-main big-btn m0a query-btn"
            :class="{'visual-disable': !newQuery}" 
            @click="handleMobileQueryClick"
          >
            {{ querying ? 'Fetching...' : 'Query' }}
          </button>
          <div class="flex jc">
            <div class="query-container">
              <h3>Decks</h3>
              <ul class="flex wrap gap">
                <li v-for="deck in selectedDecksIdNamePairs" :key="deck._id" class="query-li decks">    
                  <button @click="removeFromQuery(deck._id, 'decks')">{{ deck.name }}</button>   
                </li>
              </ul>
              <div class="spacer"></div>
              <h3>Tags</h3>
              <ul class="flex wrap gap">
                <li v-for="tag in selectedTagsArr" :key="tag" class="query-li tags">
                  <button @click="removeFromQuery(tag, 'tags')">{{ tag }}</button>
                </li>
              </ul>
            </div>
          </div>
        </section>
       
       <fieldset class="flex gap m0a" v-if="!showCardTable">
         <div class="flex gap-0 ac">
            <label for="single">Single</label>
            <input value="single" id="single" type="radio" name="mobile-query-controls" v-model="mobileRadio">
         </div>
         <div class="flex gap-0 ac">
            <label for="combine">Combine</label>
            <input id="combine" value="combine" type="radio" name="mobile-query-controls" v-model="mobileRadio">
         </div>
       </fieldset>
       
       <div class="scroll-container" v-if="!showCardTable">
          <section v-if="deckStore.decks.length">
            <h2 >Decks</h2>
            <ul class="flex col gap-0">
              <li class="flex ac gap-1" v-for="deck in deckStore.decks" :key="deck._id">
                
                <div class="rel">
                                   
                  <button class="flex ac popupBtn pad-0" @click="openMiniEditDeckPopup(deck.name)">
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
                      <!-- <li>
                        <button @click="handleExportDeckClick(deck._id, deck.name)">Export Deck</button>
                      </li> -->
                    </ul>
                  </div>
                </div>
                <!-- <RouterLink :to="`/deck/${deck._id}`">abc</RouterLink> -->
                <button 
                  @click="mobileAddToQuery(deck._id, 'decks')" 
                  class="name-btn"
                  :class="{ 'selected-query-deck': querySets.decks.has(deck._id)}"
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
                  <button class="flex ac popupBtn pad-0" @click="openMiniEditTagPopup(tag)">
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
                  @click="mobileAddToQuery(tag, 'tags')" 
                  class="name-btn"
                  :class="{ 'selected-query-tag': querySets.tags.has(tag)}"
                >
                  {{ tag }}
                </button>
              </li>
            </ul>
          </section>
        
      </div>

      
      <section v-if="showCardTable" class="flex col grow">
        <button @click="showCardTable = false" class="btn-main back-to-query-btn mt-3">Back to Query</button>
        <h2 class="tac">Cards</h2>
              

        <div class="flex jc pad control-wrap wrap gap">
          <button :disabled="!selectedCards.length" @click="modals.dueDate = true">Set Due Date</button>
          <button :disabled="!selectedCards.length" @click="modals.reset = true">Reset</button>
          <button :disabled="!selectedCards.length" @click="modals.addTag = true">Add Tag</button>
          <button :disabled="!selectedCards.length" @click="modals.removeTag = true">Remove Tag</button>
          <button :disabled="!selectedCards.length" @click="modals.delete = true">Delete</button>
        </div>
     
        <div class="table-pane">
          <ContentLoadedTransition> 
            <table v-if="cards.length">
              <colgroup>
                <col style="width:3rem">      <!-- checkbox -->
                <col class="front-col">       <!-- Front -->
                       <!-- Back -->
                <col style="width:4rem">      <!-- Edit icon -->
              </colgroup>
              <thead class="thead">
                <tr>
                  <th>
                    <input ref="mobileMaster" type="checkbox" @change="handleMasterSwitch">
                  </th>             
                  <th>Front</th>
                  
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
          
                  <td @click="handleEditRoute(card._id)" >
                    <img src="../assets/pencil.png" alt="">
                  </td>
                </tr>
              </tbody>
            </table>
            
          </ContentLoadedTransition>
        </div>
        
        
      </section>
    </div>

    <ModalForm 
      @submit="handleDeckRename" 
      @hide="resetModals(deckRenameErrors)" 
      :show="modals.editDeckName" 
      :prefill="deckName"
      label="Deck Name"
      btnText="Update Name"
      :maxLen="DECK_MAX_LEN"
      :lock="lock"
      :errors="deckRenameErrors.name" 
    />
    
    <ModalForm 
      @hide="resetModals(dueErrors)"
      :show="modals.dueDate"
      label="Set Due Date (0 = today)"
      btnText="Update"
      type="number"
      :max="MAX_DUE_DATE"
      :min="MIN_DUE_DATE"
      @submit="handleChangeDueDate"
      :lock="lock"
      :errors="dueErrors.due"
    />

    <ModalForm 
      @hide="resetModals(addRemoveTagErrors)"
      :show="modals.addTag"
      label="Add Tag to Card(s)"
      btnText="Add Tag"
      :maxLen="TAG_MAX_LEN"
      @submit="handleAddOrRemoveTag($event, 'add')"
      :lock="lock"
      :errors="addRemoveTagErrors.tag"
    />

    <ModalForm 
      @hide="resetModals(addRemoveTagErrors)"
      :show="modals.removeTag"
      label="Remove Tag to Card(s)"
      btnText="Remove Tag"
      :maxLen="TAG_MAX_LEN"
      @submit="handleAddOrRemoveTag($event, 'remove')"
      :lock="lock"
      :errors="addRemoveTagErrors.tag"
    />

    <TransitionOverlay :show="modals.deleteDeck" @hide="modals.deleteDeck = false">
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
      @submit="handleTagRename" 
      @hide="resetModals(tagRenameErrors)" 
      :show="modals.editTagName" 
      :prefill="tag"
      label="Tag Name"
      btnText="Update Name"
      :maxLen="TAG_MAX_LEN"
      :lock="lock"
      :errors="tagRenameErrors.tag" 
    /> 

    <TransitionOverlay :show="modals.reset" @hide="modals.reset = false">
      <Confirmation 
        @cancel="modals.reset = false"
        @confirm="handleResetSrs" 
        heading="Confirm Reset" 
        :message="`All card(s) progress will be reset.`"
        :lock="lock" 
      />
    </TransitionOverlay>

    <TransitionOverlay :show="modals.delete" @hide="modals.delete = false">
      <Confirmation 
        @cancel="modals.delete = false"
        @confirm="handleBulkDelete" 
        heading="Confirm Delete" 
        :message="`Selected Card(s) will be deleted permanently.`"
        :lock="lock"
        lock-message="Deleting Cards..." 
      />
    </TransitionOverlay>

    <TransitionOverlay :show="modals.deleteTag" @hide="modals.deleteTag = false">
      <Confirmation 
        @cancel="modals.deleteTag = false"
        @confirm="handleTagDelete" 
        heading="Confirm Deletion" 
        :message="`Delete tag '${tag}'`" 
        :lock="lock"
      />
    </TransitionOverlay>
    
   
    <FullScreenModalWrapper v-if="cardId">
      <EditFlashcardView :cardId="cardId" />
    </FullScreenModalWrapper>

  </div>
</template>

<script setup>
//NOTE - im refetching cards after operations for ease, but its probably better to do it a different way
//TODO - MAXLEN ON INPUT
import { onMounted, ref, reactive, useTemplateRef, watch, computed, onUnmounted } from 'vue'
import {  deleteDeck, updateDeckName, updateTagName, deleteTag,
          getDashboardCards, exportDeck, importDeck, addTag, removeTag, updateDueDate,
          resetSrs, deleteCards
       } from '../api/api.js';
import ModalForm from '../components/ModalForm.vue';
import TheHeader from '../components/TheHeader.vue'
import TransitionOverlay from '../components/TransitionOverlay.vue';
import EditFlashcardView from './EditFlashcardView.vue';
import Confirmation from '../components/alerts/Confirmation.vue';
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue'
import FullScreenModalWrapper from '../components/FullScreenModalWrapper.vue';
import { useRoute, useRouter } from 'vue-router';
import { useDeckStore } from '../stores/deckStore.js';
import { useToastStore } from '../stores/toastStore.js';
import { validate, validateNoRender } from '../helpers/validate.js';
import { addRemoveTagSchema, updateDueDateSchema, bulkPatchCardsDefaultSchema } from '@zod/card.js';
import { TAG_MAX_LEN, DECK_MAX_LEN, MAX_DUE_DATE, MIN_DUE_DATE } from '../../../shared/constants/zod/validation.js';
import { createDeckSchema } from '@zod/deck.js';
import { tagSchema } from '../../../shared/zodSchemas/tag.js';
const route = useRoute();
const router = useRouter();
const deckStore = useDeckStore();
const toastStore = useToastStore();
const modals = ref({
  deleteDeck: false,
  editDeckName: false,
  deleteTag: false,
  editTagName: false,

  importDeck: false, 
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
const exportMode = ref('backup');
const cards = ref([]);
const cardId = ref(null);
const selectedCards = ref([]); //ids
const master = useTemplateRef('master');
const mobileMaster = useTemplateRef('mobileMaster')
const lock = ref(false);
const showCardTable = ref(false);

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
const tagMode = ref('$all');
function resetQuerySets(){
  querySets.decks.clear();
  querySets.tags.clear();
}
const cardIds = computed(() => cards.value.map((c) => c?._id));

//table checkboxes master logic
watch(selectedCards, () => {
  
  const el = showCardTable.value ? mobileMaster.value : master.value;
  if (!el) return;                
  if(!cards.value.length) return;
  el.checked       = selectedCards.value.length === cards.value.length;
  el.indeterminate = selectedCards.value.length &&
                     selectedCards.value.length < cards.value.length;
});



function handleMasterSwitch(){
  let checked = showCardTable.value ? mobileMaster.value.checked : master.value.checked;
  console.log(checked);
  if(checked){
    selectedCards.value = cardIds.value;
  }else{
    selectedCards.value = [];
  }
}

function resetModals(errRef){
  for(let key of Object.keys(modals.value)){
    modals.value[key] = false;
  }
  if(errRef !== undefined){
    Object.keys(errRef).forEach((key) => errRef[key] = []);
  }
}

function extractPairIds(){
  let selectCardSet = new Set(selectedCards.value);
  let pairIds = cards.value.filter((c) => selectCardSet.has(c._id))
                           .map((card) => card?.pairId)
                           .filter((pId) => pId !== undefined);
  return pairIds;
}
function cardAndPairIds(){
  return { cardIds: [...selectedCards.value], pairIds: extractPairIds() };
}
//add or remove tag
//REFACTOR ALL THESE TO DYNAMIC FUNCTION???
const addRemoveTagErrors = ref({
  tag: []
});
async function handleAddOrRemoveTag(tag, mode){
  if(lock.value) return;
  lock.value = true;
  try{
    let payload = { tag, ...cardAndPairIds() };
   
    if(!validate(payload, addRemoveTagErrors, addRemoveTagSchema)) return;
    console.log(payload);
    if(mode === 'add'){
      await addTag(payload);
    }else if(mode === 'remove'){
      await removeTag(payload);
    }else return;
    
    resetModals();
    somethingChangedLetsFetchCards();
    await deckStore.fetchTags(); //REFETCH??
    const toastMsg = mode === 'add' ? `tag ${tag} added to cards` : `tag ${tag} removed from cards`;
    toastStore.createToast(toastMsg)
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}

//update due date
const dueErrors = ref({
  due: []
});
async function handleChangeDueDate(due){
  if(lock.value) return;
  lock.value = true;
  try{
    let payload = { due, ...cardAndPairIds() };
    
    if(!validate(payload, dueErrors, updateDueDateSchema)) return;
    await updateDueDate(payload);
    resetModals();
    somethingChangedLetsFetchCards();
    toastStore.createToast('due date updated');
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}
//reset card srs
async function handleResetSrs(){
  if(lock.value) return;
  lock.value = true;
  try{
    let payload = { ...cardAndPairIds() };
    if(!validateNoRender(payload, bulkPatchCardsDefaultSchema)) return;
    await resetSrs(payload);
    resetModals();
    somethingChangedLetsFetchCards();
    toastStore.createToast('cards srs reset');
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}

async function handleBulkDelete(){
  if(lock.value) return;
  lock.value = true;
  try{
    let payload = { ...cardAndPairIds() };
    console.log(payload);
    if(!validateNoRender(payload, bulkPatchCardsDefaultSchema)) return;
  
    await deleteCards(payload);
   
    resetModals();
    somethingChangedLetsFetchCards();
    toastStore.createToast('cards deleted');
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}



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

//to close the edit card modal
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
const newQuery = ref(false);
function addToQuery(payload, set, e){
  console.log(e);   
  if(!e.ctrlKey){
    resetQuerySets();
  }
  if(querySets[set].has(payload)){
    querySets[set].delete(payload);
  }else{
    querySets[set].add(payload);
  }
  newQuery.value = true;
}
function removeFromQuery(payload, set){
  querySets[set].delete(payload);
  newQuery.value = true;
}

const mobileRadio = ref('single');
function mobileAddToQuery(payload, set){
  if(mobileRadio.value === 'single'){
    resetQuerySets();
  }
  if(querySets[set].has(payload)){
    querySets[set].delete(payload);
  }else{
    querySets[set].add(payload);
  }
  newQuery.value = true;
}


function handleQueryClick(){
  if(!newQuery.value) return;
  somethingChangedLetsFetchCards();
}
function handleMobileQueryClick(){
  if(!newQuery.value) return;
  showCardTable.value = true;
  somethingChangedLetsFetchCards();
}
const querying = ref(false);
async function somethingChangedLetsFetchCards(){
  if(querying.value) return;
  let deckArr = Array.from(querySets.decks);
  let tagArr = Array.from(querySets.tags);
  if(!deckArr.length && !tagArr.length){
    cards.value = [];
    selectedCards.value = [];
    return;
  }
  querying.value = true; 
  try{
    cards.value = await getDashboardCards({ 
      decks: deckArr, 
      tags: tagArr,
      conditional: tagMode.value 
    });
    selectedCards.value = [];
    newQuery.value = false;
    console.log(cards.value)
  }catch(err){
    console.error(err);
  }finally{
    querying.value = false;
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
    await deckStore.fetchDecks(); //REFETCH??
    somethingChangedLetsFetchCards();
    querySets.decks.delete(deckId.value);
    toastStore.createToast(`Deck ${deckName.value} Deleted`);
    deckName.value = '';
    deckId.value = null;
    resetModals();
  }catch(err){
    console.error(err);
  }finally{
    lock.value = false;
  }
}

const deckRenameErrors = ref({
  name: []
});
async function handleDeckRename(name){
  if(lock.value) return;
  lock.value = true;
  try{
    if(!validate({ name }, deckRenameErrors, createDeckSchema)) return;
    await updateDeckName(deckId.value, { name });
    toastStore.createToast(`Name Change Success`);
    deckName.value = '';
    deckId.value = null;
    await deckStore.fetchDecks(); //DO I NEED TO REFETCH????
    resetModals();
  }catch(err){
    console.error(err);lock
  }finally{
    lock.value = false;
  }
}

const tagRenameErrors = ref({
  tag: []
});
async function handleTagRename(newName){
  if(lock.value) return;
  lock.value = true;
  try{
    if(!validate({ tag: newName }, tagRenameErrors, tagSchema)) return;
    await updateTagName(tag.value, { newName });
    toastStore.createToast(`Name Change Success`);
    tag.value = '';
    await deckStore.fetchTags(); //MIGHT NOT NEED TO REFETCH
    resetModals();
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
.decks-view-root{
  --deck-highlight: rgb(253, 208, 124);
  --tag-highlight: rgb(153, 245, 153);
  --custom-margin: 3rem;
  width: clamp(350px, 95%, 1280px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.dashboard-heading{
  margin-top: 1.2rem;
  margin-bottom: 1.2rem;
}
.query-btn{
  padding: .5em 1em;
  font-size: 1.2rem;
  display: block;
  background: var(--btn-bg-primary);
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  border-radius: 1rem;
  border: none;
  border-bottom: 4px solid rgb(245, 218, 196);
}
.visual-disable{
  background: grey;
}
.query-container{
  width: clamp(350px, 100%, 70ch);
  background: white;
  padding: 1rem;
  border-radius: 1rem;
}
.scroll-container{
  flex: 0 0 250px;
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

.import-form{
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  gap: 1rem;
  width: 300px;
}
.query-li > button{
  
}
.query-li.decks,
.selected-query-deck{
  background: var(--deck-highlight);
}
.deck-select{
  width: 250px;
}
.query-li.tags,
.selected-query-tag{
  background: var(--tag-highlight);
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

img{
  width: 24px;
}
.clamp{
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
         /* make sure nowrap isn't active      */
  overflow-wrap: anywhere;      /* break *inside* long tokens         */
  word-break: break-word;       /* legacy fallback                    */
} 

colgroup col.front-col  { width: 45%; }
colgroup col.back-col   { width: 45%; }

.table-pane{
  min-height: 0;
  overflow: auto;
  flex: 1 0 450px;
}
table{
  border-collapse: collapse;
  table-layout: auto;
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

tr:nth-child(even){
  background: #c2c2c21c;
}


ul{
  list-style:none;
  margin: 0;
}

.or-and-btn-group, .filler-margin{
  margin-top: var(--custom-margin);
}
.mobile-root{
  display: none;
}

@media(max-width: 950px){
  .big-flex{
    display: none;
  }
  .mobile-root{
    display: flex;
    min-height: 0;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
  }
  .scroll-container{
    max-width: 250px;
    margin: 0 auto;
    margin-top: 1rem;
    flex-grow: 1;
  }
  .dashboard-heading{
    font-size: 1.2rem;
    margin-top: 0;
    margin-bottom: .5rem;
    display: none;
  }
  .table-pane{
    flex: 1 0 350px;
  }
  colgroup col.front-col{
    width: 90%;
  }
  .desktop-query{
    display: none;
  }
  .filler-margin{
    display: none;
  }
  .query-btn{
    margin-top: 1rem;
  }
  .back-to-query-btn{
    width: fit-content;
    margin: 0 auto;
    margin-top: 1rem;
  }
  .query-li{
    padding: .1em .25em;
  }
  .query-li > button{
    font-size: .8rem;
  }

}
</style>