<template>
  <div class="flex jc">    
    <Flashcard :card="currentCard" :loading="loading" />
    
    <p v-if="noMoreCards" class="tac">No More Cards!</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gradeCard, fetchCardBatch } from '../api/api.js'
import Flashcard from '../components/Flashcard.vue'
import { on as onBus } from '../helpers/bus.js'
import { useCollectionStore } from '../stores/collectionStore.js'

const collectionStore = useCollectionStore();

const currentCard = ref(null);
const queue       = ref([]);

let   lastFetch   = Date.now();
const loading     = ref(true);
const noMoreCards = ref(false);


async function getBatch() {
  loading.value = true;
  try {
    const { cards } = await fetchCardBatch({ 
      want: 10, 
      collections: collectionStore.selectedFilters.collections, 
      tags: collectionStore.selectedFilters.tags,
      conditional: collectionStore.queryConditional 
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
    const card = currentCard.value;
    await gradeCard({ card, grade });
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
  await getBatch()
  console.log(queue.value)
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
