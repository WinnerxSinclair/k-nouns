<template>
  <div class="grid cmt">    
    <Flashcard :card="currentCard" :loading="loading" />
    
    <p v-if="noMoreCards" class="tac">No More Cards!</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gradeCard, getCardBatch } from '../api/api.js'
import Flashcard from '../components/Flashcard.vue'
import { on as onBus } from '../helpers/bus.js'
import { useDeckStore } from '../stores/deckStore.js'

const deckStore = useDeckStore();

const currentCard = ref(null);
const queue       = ref([]);

let   lastFetch   = Date.now();
const loading     = ref(true);
const noMoreCards = ref(false);


async function getBatch() {
  loading.value = true;
  try {
    const { cards } = await getCardBatch({ 
      decks: deckStore.selectedFilters.decks, 
      tags: deckStore.selectedFilters.tags,
      conditional: deckStore.queryConditional 
    });
    console.log(cards)
    queue.value.push(...cards)
    lastFetch = Date.now()
  } catch (err) {
    console.error(err)
  } finally{
    loading.value = false;
  }
}


let offGradeListener = null;

function showCard(){
  if(queue.value.length){
    currentCard.value = queue.value.shift();
    offGradeListener = onBus('grade', (grade) => {
      offGradeListener(); 
      offGradeListener = null; 
      gradeCard_local(grade);
    });
  }else{
    currentCard.value = null;
    noMoreCards.value = true;
  }
}

async function gradeCard_local(grade){
  if(loading.value) return;
  loading.value = true;
  try{
    console.log(currentCard.value);
    const card = currentCard.value;
    const { reps, interval, ease, lapses, _id } = currentCard.value;
    currentCard.value = null;
    await gradeCard({ reps, interval, ease, lapses, _id, grade });
    if(queue.value.length === 0){
      await getBatch();
    }
    showCard();
  }catch(err){
    console.error(err);
  }finally{
    loading.value = false;
  }
}


onMounted(async () => {
  await getBatch();
  showCard();
});

//cleanup
onUnmounted(() => {
  if(offGradeListener){
    offGradeListener();
    offGradeListener = null;
  }
});
</script>

<style scoped>
.cmt{
  margin-top: 5rem;
}
.grid{
  display: grid;
  justify-content: center;
}
</style>
