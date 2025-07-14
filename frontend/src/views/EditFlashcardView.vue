<template>
  <div class="abs flex edit-card-wrap col ac grow" v-if="!loading && form">
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

      <div class="flex gap ac mt-3">
        <label>Tags</label>
        <button class="img-btn" @click="showTagForm = true" type="button">
          <img class="block" src="../assets/add.png" alt="">
        </button>
      </div>

      <ul class="flex gap wrap tag-list">
        <li class="tag-btn-wrapper" v-for="tag in deckStore.tags" :key="tag">
          <button type="button" 
            @click="prepTags(tag)"
            :class="{'selected-tag': tags.has(tag)}"
          > {{ tag }}
          </button>
        </li>
      </ul>

      <br>
      <FlatButton text="Save Entry" :disabled="!form.back.length || !form.front.length" />
      
    </form>
    

    <ModalForm label="Tag" :show="showTagForm" @hide="showTagForm = false" @submit="addTagLocal" />
   
  </div>
  <div class="tac fs-500" v-else-if="!loading && !form">Problem getting card or card doesn't exist.</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { translate, explain, deleteCard, getCard, createTag, updateCard } from '../api/api.js'
import { useDeckStore } from '../stores/deckStore.js'
import { useUserStore } from '../stores/userStore.js'
import { useToastStore } from '../stores/toastStore.js' 
import TheHeader from '../components/TheHeader.vue'
import TheTextarea from '../components/TheTextarea.vue'
import TheOverlay from '../components/widgets/TheOverlay.vue'
import TheSpinner from '../components/widgets/TheSpinner.vue'
import ModalForm from '../components/ModalForm.vue'
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
const showTagForm = ref(false);
const loading = ref(true);

const tags = ref(new Set());

async function handleCardDelete(){ //NOT VALID ANYMORE
  try{
    await deleteCard(props.cardId);
    router.replace(`/deck/${form.value.deckId}`)
  }catch(err){
    console.error(err);
  }finally{

  }
}
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

const addTagLocal = async (tag) => {
  if(submitting.value) return;
  submitting.value = true;
  try{
    await createTag({ tagName: tag });
    await deckStore.fetchTags();
    showTagForm.value = false;
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
.edit-card-wrap{
  z-index: 2;
  width: 100%;
  background: rgb(255, 253, 247);
  min-height: 100vh;
}
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
button:not(.img-btn){
  width: fit-content;
  margin-top: .5rem;
 
}
</style>