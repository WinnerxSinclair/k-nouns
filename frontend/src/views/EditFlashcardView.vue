<template>
  <div class="flex edit-card-wrap col ac" v-if="!loading && form">
    <RouterLink class="back-btn" :to="{path: '/dashboard', replace: true }">
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
    </RouterLink>

    <TheHeader header="Edit Card" />
    <TokenCount :tokenCount="userStore.tokens" />
    <form @submit.prevent="saveEntry" > 
      <TheTextarea 
        v-model="form.context" 
        label="Context" 
        placeholder="e.g. 22yr old male speaking to younger brother"
        :maxLength="MAX_LENGTHS.context" 
      />
      <ErrorRender :errors="errorForm.context" />

      <TheTextarea 
        v-model="form.front" 
        label="English*"
        :required="true"
        :maxLength="MAX_LENGTHS.front" 
      />
      <ErrorRender :errors="errorForm.front" />

      <FlatButton
        text="Translate"
        type="button" 
        :disabled="translateLoading" 
        @pressed="translateClicked" 
      />
      <ErrorRender :errors="translateErrors.context" />
      <ErrorRender :errors="translateErrors.front" />
      
      <TheSpinner v-if="translateLoading" />

      <TheTextarea 
        v-model="form.back" 
        label="Korean*"
        :required="true"
        :maxLength="MAX_LENGTHS.back" 
      />
      <ErrorRender :errors="errorForm.back" />

      <FlatButton
        text="Explain"
        type="button" 
        :disabled="explainLoading"
        @pressed="explainClicked" 
      />
      <ErrorRender :errors="explainErrors.back" /> 
      <TheSpinner v-if="explainLoading" />

      <TheTextarea 
        v-model="form.explanation" 
        label="Explanation"
        :maxLength="MAX_LENGTHS.explanation" 
      />
      <ErrorRender :errors="errorForm.explanation" />

      <Teleport to="body">
        <LockScreen v-if="savingForm">
          <TheSpinner />
        </LockScreen>
      </Teleport>

      <div class="mt-3 gap flex">        
        <label for="mirror">{{ form?.pairId ? 'Edit Mirror As Well?' : 'Add Mirror?' }}</label>
        <input id="mirror" type="checkbox" v-model="form.mirror">
      </div>
      <ErrorRender :errors="errorForm.mirror" />

      <section class="flex col gap">
        <div class="flex gap ac mt-3">
          <label for="sortOrAddTags">Tags</label>
          <input 
            id="sortOrAddTags" 
            type="text" 
            v-model.trim="tagInput" 
            :minLength="TAG_MIN_LEN"
            :maxlength="TAG_MAX_LEN" 
            :disabled="submitting"
            @keydown.enter.prevent="handleAddTagClick(tagInput)"          
          >
          <button class="arrow-btn" type="button" @click="handleAddTagClick(tagInput)" :disabled="submitting">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffffde"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/></svg>
          </button>
        </div>
        <ErrorRender :errors="addTagErrors.tag" />
        <ErrorRender :errors="errorForm.tags" />
  
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
      <FlatButton text="Save Entry" :disabled="savingForm" />
      
    </form>
   
  </div>
  <div class="tac fs-500" v-else-if="!loading && !form">Problem getting card or card doesn't exist.</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { translate, explain, getCard, createTag, updateCard } from '../api/api.js'
import { useDeckStore } from '../stores/deckStore.js'
import { useUserStore } from '../stores/userStore.js'
import { useToastStore } from '../stores/toastStore.js'
import { updateCardSchema } from '@zod/card.js'
import { translateSchema, explainSchema } from '@zod/claude.js'
import { tagSchema } from '@zod/tag.js'
import { validate } from '../helpers/validate.js'
import { 
  CONTEXT_MAX_LEN, 
  FRONT_MAX_LEN, 
  BACK_MAX_LEN, 
  EXPLANATION_MAX_LEN,
  TAG_MAX_LEN,
  TAG_MIN_LEN,
  TAG_ARR_MAX_LEN 
} from '@zodConsts/validation.js' 
import TheHeader from '../components/TheHeader.vue'
import TheTextarea from '../components/TheTextarea.vue'
import TheSpinner from '../components/widgets/TheSpinner.vue'
import FlatButton from '../components/buttons/FlatButton.vue'
import TokenCount from '../components/widgets/TokenCount.vue'
import ErrorRender from '../components/widgets/ErrorRender.vue'
import LockScreen from '../components/LockScreen.vue'
import { useRouter } from 'vue-router'
const router = useRouter();
const props = defineProps({
  cardId: String
});
const MAX_LENGTHS = {
  context: CONTEXT_MAX_LEN,
  front: FRONT_MAX_LEN,
  back: BACK_MAX_LEN,
  explanation: EXPLANATION_MAX_LEN
}
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
const errorForm = ref({
  context: [],
  front: [],
  back: [],
  explanation: [],
  mirror: [],
  tags: []
});

const translateErrors = ref({
  context: [],
  front: []
});

const explainErrors = ref({
  back: []
});

const addTagErrors = ref({
  tag: []
});
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
  if(translateLoading.value) return;
  const { front, context } = form.value;
  const body = {
    front, 
    ...(context && { context })
  }
  translateLoading.value = true;
  try{
    if(!validate(body, translateErrors, translateSchema)) return;
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
    translateLoading.value = false;
  }
}

function prepTags(tag){
  if(tags.value.has(tag)){
    tags.value.delete(tag);
    return;
  }

  if(tags.value.size < TAG_ARR_MAX_LEN){
    tags.value.add(tag);
  }
  
}

const explainClicked = async () => {
  if(explainLoading.value) return;
  const { back } = form.value;
  explainLoading.value = true;
  try{
    if(!validate({ back }, explainErrors, explainSchema)) return;
    if(!userStore.hasEnough) return;
    const recheck = await userStore.fetchTokens();
    if(recheck <= 0) return;
    const response = await explain({ back });
    const { message, updatedTokenCount } = response;
    form.value.explanation = message;
    userStore.updateTokenCount(updatedTokenCount);
    
  }catch(err){
    console.error(err);
    errMsg.value = 'Something went wrong.'
  }finally{
    explainLoading.value = false;
  }
}

const handleAddTagClick = async (tag) => {
  if(submitting.value) return;
  submitting.value = true;
  try{
    if(!validate({ tag }, addTagErrors, tagSchema)) return;
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
  if(savingForm.value) return;
  savingForm.value = true;
  try{
    if(tags.value.size){
      form.value.tags = Array.from(tags.value);
    }
    let payload = {
      ...form.value,
    }
    if(!validate(payload, errorForm, updateCardSchema)) return;
    await updateCard(props.cardId, payload);
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
    const card = await getCard(props.cardId);
    
    form.value = { 
      ...card,
      mirror: card?.pairId ? true : false 
    };
    tags.value = new Set(card.tags);
  }catch(err){
    console.error(err);
  }finally{
    loading.value = false;
  }  
});

</script>






<style scoped>

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
  width: clamp(350px, 100%, 62ch);
}

</style>