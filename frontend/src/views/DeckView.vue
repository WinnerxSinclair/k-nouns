<template>
  <div class="deck-root" v-if="!loading && deckName">
    <div class="flex jfe">
      <div class="flex col gap-0">
        <DynamicButton 
          styles="delete" 
          type="button" 
          text="Delete Deck" 
          @pressed="modals.deleteCol = true" 
        />
        <DynamicButton   
          styles="edit" 
          type="button" 
          text="Edit Name" 
          @pressed="modals.editColName = true" 
        />
        <DynamicButton   
          styles="edit" 
          type="button" 
          text="Share Code" 
          @pressed="handleShareCodePress" 
        />
      </div>
    </div>

    <TransitionOverlay :show="modals.shareCol" @hide="modals.shareCol = false">
      <div class="flex col gap share-code-wrap">
        <label for="share-code">Share code:</label>
        <div class="flex ac gap">          
          <code class="fs-500" id="share-code">{{ shareCode }}</code>
          <button aria-label="Copy share code" onclick="navigator.clipboard.writeText(document.getElementById('share-code').textContent)">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          </button>
        </div>
      </div>
    </TransitionOverlay>

    <TransitionOverlay :show="modals.deleteCol" @hide="modals.deleteCol = false">
      <Confirmation 
        @cancel="modals.deleteCol = false"
        @confirm="handleDeckDelete" 
        heading="Confirm Deletion" 
        :message="`Delete deck ${deckName} and all cards in it?`" 
      />
    </TransitionOverlay>

    <ModalForm 
      @submit="handleUpdateName" 
      @hide="modals.editColName = false" 
      :show="modals.editColName" 
      :prefill="deckName"
      
      btnText="Update Name" 
    />
    
    <TheHeader :header="deckName" :mBot="0" />

    <div class="tac" v-show="deckName">
      <RouterLink :to="`/deck/${deckId}/entry`" class="new-card-btn">New Card</RouterLink>
    </div>

    <ContentLoadedTransition>      
      <ul v-if="cards.length && deckName">
        <li class="flex jsb ac" v-for="(card, i) in cards" :key="card._id">
          <RouterLink :to="`/card/${card._id}`" class="card-link flex jsb">
            {{ card.front }}
          </RouterLink>        
        </li>
      </ul>
    </ContentLoadedTransition>
  </div>
  <div class="tac fs-500" v-else-if="!loading && !deckName">This Deck Doesn't Exist</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getCards, deleteDeck, updateDeckName, createOrUpdateShare } from '../api/api';
import { useDeckStore } from '../stores/deckStore';
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue';
import DynamicButton from '../components/buttons/DynamicButton.vue';
import TheHeader from '../components/TheHeader.vue';
import Confirmation from '../components/alerts/Confirmation.vue';
import TransitionOverlay from '../components/TransitionOverlay.vue';
import ModalForm from '../components/ModalForm.vue';
import router from '../router'

const props = defineProps({
  deckId: String,
});

const deckStore = useDeckStore();
const deckName = computed(() => deckStore.deckMap[props.deckId]);
const shareCode = ref(null);

const modals = ref({
  deleteCol: false,
  editColName: false,
  shareCol: false
});

const cards = ref([]);
const loading = ref(true);

async function handleUpdateName(name){
  try{
    await updateDeckName(props.deckId, { name });
    deckStore.setIdName(props.deckId, name);
  }catch(err){
    console.error(err);
  }
}

async function handleShareCodePress(){
  if(shareCode.value){
    modals.value.shareCol = true;
    return;
  }
  shareCode.value = crypto.randomUUID();
  console.log(props.deckId);

  try{
    const doc = await createOrUpdateShare({ 
      code: shareCode.value, 
      deckId: props.deckId, 
    });
    console.log(doc);
    shareCode.value = doc._id;
    modals.value.shareCol = true;
  }catch(err){
    shareCode.value = null;
    console.error(err);
  }
  
}

async function handleDeckDelete(){
  try{
    await deleteDeck(props.deckId);
    delete deckStore.deckMap[props.deckId];
    router.replace('/dashboard');
  }catch(err){
    console.error(err);
  }
}

onMounted(async () => {
  try{
    const response_cards = await getCards(props.deckId);
    
    if(!deckName.value){
      let name = await deckStore.fetchDeckById(props.deckId);
      deckStore.setIdName(props.deckId, name);
    }
    cards.value = response_cards;

  }catch(err){
    console.error(err);
  }finally{
    loading.value = false;
  }
})
</script>

<style scoped>
.share-code-wrap{
  background: white;
  padding: 2rem 2rem;
  border-radius: 1rem;
}

.deck-root{
  max-width: 160ch;
  margin: 0 auto;
}
.card-link{
  padding: .5em 1em;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  flex-grow: 1;
}
.new-card-btn{
  text-decoration: none;
  color: var(--btn-color-primary);
  background: var(--btn-bg-primary);
  display: inline-block;
  padding: .5em 1em;
  border-radius: 9999px;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
ul{
  list-style: none;
  display:grid;
  grid-template-columns: repeat(auto-fit, 35ch);
  margin: 0;
  gap:1.5rem 5ch ;
  justify-content: center;
  padding: 1rem;
}
li{
  background: white;
  
  border: 1px solid rgba(0, 0, 0, 0.301);;
  cursor: pointer; 
}
li:hover{
  background: rgb(202, 202, 202);
}


.icon{
  --w: 25px;
  width: var(--w);
  min-width: var(--w);
  height: var(--w);
  margin-right: 1rem;
  cursor: pointer;
  border-radius: 50%;
}
.icon:hover{
  background: rgb(117, 117, 117);
}
</style>