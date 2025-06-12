<template>
  <div class="flex col ac grow">
    <div class="fs-500">{{ collectionName }}</div>
    <TheHeader header="New Entry" />
    <form @submit.prevent="saveEntry" > 
      <TheTextarea 
        v-model="form.context" 
        label="Context" 
        placeholder="e.g. 22yr old male speaking to younger brother" 
      />

      <TheTextarea 
        v-model="form.front" 
        label="English" 
      />

      <button :disabled="form.back.length || !form.front.length || translateLoading" type="button" @click="translateClicked">Translate</button>
      <TheSpinner v-if="translateLoading" />
      <TheTextarea 
        v-model="form.back" 
        label="Korean"
        :required="true" 
      />

      <button :disabled="form.explanation.length || !form.back.length || explainLoading" type="button" @click="explainClicked">Explain</button>
      <TheSpinner v-if="explainLoading" />
      <TheTextarea 
        v-model="form.explanation" 
        label="Explanation" 
      />

      <TheOverlay v-if="savingForm">
        <TheSpinner />
      </TheOverlay>

      <div class="mt-3">        
        <label for="mirror">Mirror?</label>
        <input id="mirror" type="checkbox" v-model="form.mirror">
      </div>

      <div class="flex gap ac mt-3">
        <label>Tags</label>
        <button @click="showTagForm = true" type="button" style="margin: 0">+</button>
      </div>

      <ul class="flex gap">
        <li v-for="tag in collectionStore.tags" :key="tag">
          <button type="button" 
            @click="prepTags(tag)"
            :style="[tags.has(tag) ? 'background: blue' : '']"
          > {{ tag }}
          </button>
        </li>
      </ul>

      <button :disabled="!form.back.length">Save Entry</button>
    </form>

    <ModalForm label="Tag" :show="showTagForm" @hide="showTagForm = false" @submit="addTagLocal" /> 
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { translate, explain } from '../api/api.js'
import { useCollectionStore } from '../stores/collectionStore.js'
import { createTag, createCard } from '../api/api.js'
import TheHeader from '../components/TheHeader.vue'
import TheTextarea from '../components/TheTextarea.vue'
import TheOverlay from '../components/widgets/TheOverlay.vue'
import TheSpinner from '../components/widgets/TheSpinner.vue'
import ModalForm from '../components/ModalForm.vue'

const props = defineProps({
  id: String
});
const collectionName = computed(() => collectionStore.collectionMap[props.id]);
const collectionStore = useCollectionStore();

const form = ref({
  context: '',
  front: '',
  back: '',
  explanation: '',
  mirror: false,
  tags: []
});

const submitting = ref(false);
const translateLoading = ref(false);
const explainLoading = ref(false);
const savingForm = ref(false);
const errMsg = ref(null);
const showTagForm = ref(false);

const tags = ref(new Set());

const translateClicked = async () => {
  const { front, context } = form.value;
  const body = {
    front, 
    ...(context && { context })
  }
  translateLoading.value = true;
  try{
    const response = await translate(body);
    form.value.back = response.message;
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
    const response = await explain({back});
    console.log(response)
    form.value.explanation = response.message;
    
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
    await collectionStore.store_fetchTags();
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
    group_id: props.id,
    ...form.value,
  }

  try{
    await createCard(props.id, payload);
    await collectionStore.store_fetchCollectionTags(props.id);
  }catch(err){
    console.error(err);
  }finally{
    savingForm.value = false;
  }
}

onMounted(async () => {
  if(!collectionName.value){
    let name = await collectionStore.store_fetchCollectionById(props.id);
    collectionStore.setIdName(props.id, name);
  }
});
</script>

<style scoped>
ul{
  list-style: none;
  margin: 0;
}
form{
  width: clamp(350px, 50%, 550px);
}
button{
  width: fit-content;
  margin-top: .5rem;
}
</style>