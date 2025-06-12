<template>
  <div v-if="card" class="card">
    <div class="grade-btn-wrap flex gap jc" v-if="seedCalculations.length">
      <div class="flex col ac">
        <div>{{ seedCalculations[0] }}m</div>
        <button @click="grade(1)">Again</button>
      </div>
      <div class="flex col ac">
        <div>{{ seedCalculations[1] }}d</div>
        <button @click="grade(3)">Hard</button>
      </div>
      <div class="flex col ac">
        <div>{{ seedCalculations[2] }}d</div>
        <button @click="grade(4)">Good</button>
      </div>
      <div class="flex col ac">
        <div>{{ seedCalculations[3] }}d</div>
        <button @click="grade(5)">Easy</button>
      </div>
    </div>
    
    <div class="tac fs-600">{{ card.front }}</div>
    <div v-if="showBack" class="tac">
      <div class="line"></div>
      <div class="fs-600">{{ card.back }}</div>
    </div>

    <div v-if="showExplanation" class="explanation">
      <div class="line"></div>
      <div v-html="markedExplanation"></div>
    </div>
    <div class="tac mt-3">
      <button v-if="!showBack" @click="showBack = true">Show Answer</button>
      <button v-if="card.explanation && showBack && !showExplanation" @click="showExplanation = true">
        Show Explanation
      </button>
    </div>


  </div>
 
</template>

<script setup>
import { ref, watch } from 'vue'
import { emit } from '../helpers/bus.js'
import { marked } from 'marked'
import { schedule } from '../helpers/seedCalculations.js';

const props = defineProps({
  card: Object
});
let grades = [1, 3, 4, 5];
let seedCalculations = ref([]);
const showBack = ref(false);
const showExplanation = ref(false);
const markedExplanation = ref(null);

watch(() => props.card, () => { 

  showBack.value = false;
  showExplanation.value = false;
  if(props.card?.explanation){
    markedExplanation.value = marked.parse(props.card.explanation);
  }
  if(props.card){
    seedCalculations.value = grades.map((grade) => schedule({
      reps: props.card.reps,
      interval: props.card.interval,
      ease: props.card.ease
    }, grade));
  }else{
    seedCalculations.value = [];
  } 
});

function grade(q){
  emit('grade', q);
}
</script>


<style scoped>
.card{
  max-width: 60ch;
}

.line{
  width: min(60ch, 50vw);
  height: 2px;
  background: black;
  margin-top:1.5rem;
  margin-bottom: 1.5rem;
}

.grade-btn-wrap{
  margin-bottom: 4rem;
}
.grade-btn-wrap button{
  border-radius: 9999px;
  padding: .5em 1em;
  cursor:pointer;
}


</style>