<template>
  <div class="flex col ac">
    
    <button class="btn-main big-btn" @click="modals.addDeck = true">+ Create Deck</button>
    <ul class="flex col gap">
      <li v-for="deck in deckStore.decks" :key="deck._id" class="flex">
        <RouterLink class="deck-name" :to="`/deck/${deck._id}/entry`">{{ deck.name }}</RouterLink>         
      </li>
    </ul>
  </div>
  <ModalForm
    label="Deck Name" 
    :show="modals.addDeck" 
    @submit="handleCreateDeck" 
    @hide="modals.addDeck = false"
    :maxLen="DECK_MAX_LEN"
  />

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDeckStore } from '../stores/deckStore.js';
import { useToastStore } from '../stores/toastStore.js';
import ModalForm from '../components/ModalForm.vue';
import { createDeck } from '../api/api.js'
import { DECK_MAX_LEN } from '../../../shared/constants/zod/validation.js';
const deckStore = useDeckStore();
const toastStore = useToastStore();
const modals = ref({
  addDeck: false
});
const submitting = ref(false);
async function handleCreateDeck(name){
  if(submitting.value) return;
  submitting.value = true;
  try{
    await createDeck({ name });
    await deckStore.fetchDecks(); //REFETCH??
    modals.value.addDeck = false;
    toastStore.createToast(`Deck ${name} created`);
  }catch(err){
    console.error(err);
  }finally{
    submitting.value = false;
  }
}
onMounted(async () => {
  try{
    if(!deckStore.decks.length){
      await deckStore.fetchDecks();
    }
  }catch(err){
    console.error(err);
  }
});
</script>

<style scoped>
.big-btn{
  padding: .5em 1em;
  font-size: 1.2rem;
  border-radius: 9999px;
  margin-top: 2rem;
  margin-bottom: 3rem;
  transition: opacity 1s ease;
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  user-select: none;
}

ul{
  list-style:none;
  margin: 0;
}

.deck-name{
  font-size: 1.2rem;
  text-decoration: underline solid brown;
}
</style>