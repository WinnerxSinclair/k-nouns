<template>
  <ContentLoadedTransition>
    <div v-if="card" class="card">
      <div class="grade-btn-wrap flex gap jc" v-if="seedCalculations.length">
        <div class="flex col ac" v-for="(btn, i) in gradeBtnsInfo" :key="btn.name">
          <div>{{ seedCalculations[i] }}{{ btn.suffix }}</div>
          <button :disabled="loading" @click="grade(btn.value)">{{ btn.name }}</button>
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
  </ContentLoadedTransition>

 
</template>

<script setup>
import { ref, watch } from 'vue'
import { emit } from '../helpers/bus.js'
import { marked } from 'marked'
import { schedule } from '../helpers/seedCalculations.js';
import ContentLoadedTransition from './widgets/ContentLoadedTransition.vue';
const props = defineProps({
  card: Object,
  loading: Boolean
});
const gradeBtnsInfo = [
  { suffix: 'm', name: 'Again', value: 1 },
  { suffix: 'd', name: 'Hard', value: 3 },
  { suffix: 'd', name: 'Good', value: 4 },
  { suffix: 'd', name: 'Easy', value: 5 },
]
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
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;

}

.line{
  width: min(60ch, 50vw);
  height: 2px;
  background: black;
  margin-top:1.5rem;
  margin-bottom: 1.5rem;
}
button{
  background-color: var(--btn-bg-primary);
  color: var(--btn-color-primary);
  border: 1px solid black;
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