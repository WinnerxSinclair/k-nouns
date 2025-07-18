<template>
  <div class="flex edit-card-wrap col ac" v-if="!loading && form">
    <button class="back-btn">Back (insert arrow)</button>
    <!-- <div class="flex jfe">
      
        <DynamicButton 
          styles="delete" 
          type="button" 
          text="Delete Card" 
          @pressed="handleCardDelete" 
        />
      
    </div> -->
    <TheHeader header="Edit Card" />
    <TokenCount :tokenCount="userStore.tokens" />
    <form @submit.prevent="saveEntry" > 
      <TheTextarea 
        v-model="form.context" 
        label="Context" 
        
      />

      <TheTextarea 
        v-model="form.front" 
        label="English*" 
      />

      <FlatButton
        text="Translate"
        type="button" 
        :disabled="form.back.length || !form.front.length || translateLoading || !userStore.hasEnough" 
        @pressed="translateClicked" 
      />
      <TheSpinner v-if="translateLoading" />

      <TheTextarea 
        v-model="form.back" 
        label="Korean*"
        :required="true" 
      />

      <FlatButton
        text="Explain"
        type="button" 
        :disabled="form.explanation.length || !form.back.length || explainLoading || !userStore.hasEnough"
        @pressed="explainClicked" 
      /> 
      <TheSpinner v-if="explainLoading" />

      <TheTextarea 
        v-model="form.explanation" 
        label="Explanation" 
      />

      <TheOverlay v-if="savingForm">
        <TheSpinner />
      </TheOverlay>

      <div class="mt-3 gap flex">        
        <label for="mirror">{{ form?.pairId ? 'Edit Mirror As Well?' : 'Add Mirror?' }}</label>
        <input id="mirror" type="checkbox" v-model="form.mirror">
      </div>

      <section class="flex col gap">
        <div class="flex gap ac mt-3">
          <label>Tags</label>
          <input type="text" v-model.trim="tagInput" maxlength="20" :disabled="submitting">
          <button class="arrow-btn" type="button" @click="handleAddTagClick(tagInput)" :disabled="submitting">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffffde"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>
          </button>
        </div>

  
        <ul class="flex gap wrap tag-container">
          <li class="tag-btn-wrapper" v-for="tag in filteredTags" :key="tag">
            <button type="button" 
              @click="prepTags(tag)"
              :class="{'selected-tag': tags.has(tag)}"
            > {{ tag }}
            </button>
          </li>
        </ul>
      </section>

      <br>
      <FlatButton text="Save Entry" :disabled="!form.back.length || !form.front.length" />
      
    </form>
   
  </div>
  <div class="tac fs-500" v-else-if="!loading && !form">Problem getting card or card doesn't exist.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { translate, explain, deleteCard, getCard, createTag, updateCard } from '../api/api.js'
import { useDeckStore } from '../stores/deckStore.js'
import { useUserStore } from '../stores/userStore.js'
import { useToastStore } from '../stores/toastStore.js' 
import TheHeader from '../components/TheHeader.vue'
import TheTextarea from '../components/TheTextarea.vue'
import TheOverlay from '../components/widgets/TheOverlay.vue'
import TheSpinner from '../components/widgets/TheSpinner.vue'
import FlatButton from '../components/buttons/FlatButton.vue'
import TokenCount from '../components/widgets/TokenCount.vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const props = defineProps({
  cardId: String
});

const userStore = useUserStore();
const deckStore = useDeckStore();
const toastStore = useToastStore();
const form = ref(null);

const submitting = ref(false);
const translateLoading = ref(false);
const explainLoading = ref(false);
const savingForm = ref(false);
const errMsg = ref(null);
const loading = ref(true);
const tagInput = ref('');

const tags = ref(new Set());

const normalizedTags = computed(() => 
  deckStore.tags.map((t) => ({ raw: t, low: t.toLowerCase() }))
);
const filteredTags = computed(() => {
  const q = tagInput.value.trim().toLowerCase()

  const base = q
    ? normalizedTags.value          
        .filter(({ low }) => low.includes(q))
        .map(({ raw }) => raw)
    : deckStore.tags.slice()       

  return base.toSorted(
    (a, b) => Number(tags.value.has(b)) - Number(tags.value.has(a))
  )
});
const translateClicked = async () => {
  const { front, context } = form.value;
  const body = {
    front, 
    ...(context && { context })
  }
  translateLoading.value = true;
  try{
    if(!userStore.hasEnough) return;
    const recheck = await userStore.fetchTokens();
    if(recheck <= 0) return;
    const response = await translate(body);
    const { message, updatedTokenCount } = response;
    form.value.back = message;
    userStore.updateTokenCount(updatedTokenCount);
  }catch(err){
    console.error(err)
  }finally{
    console.log('translate finaly')
    translateLoading.value = false;
  }
}

function prepTags(tag){
  if(tags.value.has(tag)){
    tags.value.delete(tag);
  }else{
    tags.value.add(tag);
  }
}

const explainClicked = async () => {
  const { back } = form.value;
  explainLoading.value = true;
  try{
    if(!userStore.hasEnough) return;
    const recheck = await userStore.fetchTokens();
    if(recheck <= 0) return;
    const response = await explain({back});
    const { message, updatedTokenCount } = response;
    form.value.explanation = message;
    userStore.updateTokenCount(updatedTokenCount);
    
  }catch(err){
    console.error(err);
    errMsg.value = 'Something went wrong.'
  }finally{
    console.log('explain finally')
    explainLoading.value = false;
  }
}

const handleAddTagClick = async (tag) => {
  if(!tag.trim()) return;
  if(submitting.value) return;
  submitting.value = true;
  
  try{
    await createTag({ tagName: tag });
    await deckStore.fetchTags(); //REFETCH???
    tags.value.add(tag);
    tagInput.value = '';
    toastStore.createToast(`Tag ${tag} created`);
  }catch(err){
    console.error(err);
  }finally{
    submitting.value = false;
  }
}

const saveEntry = async () => {
  savingForm.value = true;
  if(tags.value.size){
    form.value.tags = Array.from(tags.value);
  }
  let payload = {
    ...form.value,
  }

  try{
    await updateCard(props.cardId, payload);
    // await deckStore.fetchDeckTags(props.id);
    router.replace('/dashboard');
    const toastMsg = 'Card Edited';
    toastStore.createToast(toastMsg)
  }catch(err){
    console.error(err);
  }finally{
    savingForm.value = false;
  }
}

onMounted(async () => {
  if(userStore.tokens === null){
    await userStore.fetchTokens();
  }
  if(!deckStore.tags.length){
    await deckStore.fetchTags();
  }
  try{
    console.log(props.cardId)
    const card = await getCard(props.cardId);
    
    form.value = { 
      ...card,
      mirror: card?.pairId ? true : false 
    };
    console.log(form.value);
    tags.value = new Set(card.tags);
  }catch(err){
    console.error(err);
  }finally{
    loading.value = false;
  }  
});

</script>






<style scoped>
/* .edit-card-wrap{
  z-index: 2;
  width: 100%;
  background: rgb(255, 253, 247);
  min-height: 100vh;
} */
.back-btn{
  position:absolute;
  top: 10px;
  left: 10px;
}
.tag-btn-wrapper > button{
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.096);
}
.tag-btn-wrapper > button.selected-tag {
  background: rgb(255, 219, 195);
  border: 1px solid rgb(245, 140, 70);
}
ul{
  list-style: none;
  margin: 0;
}
form{
  width: clamp(350px, 50%, 550px);
}

.tag-container{
  max-height: 200px;
  overflow: scroll;
}
</style>