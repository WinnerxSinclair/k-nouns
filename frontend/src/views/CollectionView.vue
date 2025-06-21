<template>
  <div class="collection-root" v-if="!loading && collectionName">
    <div class="flex jfe">
      <div class="flex col gap-0">
        <DynamicButton 
          styles="delete" 
          type="button" 
          text="Delete Collection" 
          @pressed="modals.deleteCol = true" 
        />
        <DynamicButton
           
          styles="edit" 
          type="button" 
          text="Edit Name" 
          @pressed="modals.editColName = true" 
        />
      </div>
    </div>

    <TransitionOverlay :show="modals.deleteCol" @hide="modals.deleteCol = false">
      <Confirmation 
        @cancel="modals.deleteCol = false"
        @confirm="handleCollectionDelete" 
        heading="Confirm Deletion" 
        :message="`Delete collection ${collectionName} and all cards in it?`" 
      />
    </TransitionOverlay>

    <ModalForm 
      @submit="handleUpdateName" 
      @hide="modals.editColName = false" 
      :show="modals.editColName" 
      :prefill="collectionName"
      
      btnText="Update Name" 
    />
    
    <TheHeader :header="collectionName" :mBot="0" />

    <div class="tac" v-show="collectionName">
      <RouterLink :to="`/collection/${colId}/entry`" class="new-card-btn">New Card</RouterLink>
    </div>

    <ContentLoadedTransition>      
      <ul v-if="cards.length && collectionName">
        <li class="flex jsb ac" v-for="(card, i) in cards" :key="card._id">
          <RouterLink :to="`/card/${card._id}`" class="card-link flex jsb">
            {{ card.front }}
          </RouterLink>        
        </li>
      </ul>
    </ContentLoadedTransition>
  </div>
  <div class="tac fs-500" v-else-if="!loading && !collectionName">This Collection Doesn't Exist</div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getCards, deleteCollection, updateCollectionName } from '../api/api';
import { useCollectionStore } from '../stores/collectionStore';
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue';
import DynamicButton from '../components/buttons/DynamicButton.vue';
import TheHeader from '../components/TheHeader.vue';
import Confirmation from '../components/alerts/Confirmation.vue';
import TransitionOverlay from '../components/TransitionOverlay.vue';
import ModalForm from '../components/ModalForm.vue';
import router from '../router'

const props = defineProps({
  colId: String,
});

const collectionStore = useCollectionStore();
const collectionName = computed(() => collectionStore.collectionMap[props.colId]);

const modals = ref({
  deleteCol: false,
  editColName: false
});

const cards = ref([]);
const loading = ref(true);

async function handleUpdateName(name){
  try{
    await updateCollectionName(props.colId, { name });
    collectionStore.setIdName(props.colId, name);
  }catch(err){
    console.error(err);
  }
}

async function handleCollectionDelete(){
  try{
    await deleteCollection(props.colId);
    delete collectionStore.collectionMap[props.colId];
    router.replace('/dashboard');
  }catch(err){
    console.error(err);
  }
}

onMounted(async () => {
  try{
    const response_cards = await getCards(props.colId);
    
    if(!collectionName.value){
      let name = await collectionStore.fetchCollectionById(props.colId);
      collectionStore.setIdName(props.colId, name);
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
.collection-root{
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