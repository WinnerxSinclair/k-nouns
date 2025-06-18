<template>
  <div>
    <h1 class="tac">{{ collectionName }}</h1>
    <div class="tac" v-show="collectionName">
      <RouterLink :to="`/collection/${id}/entry`" class="new-card-btn">New Card</RouterLink>
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
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { fetchCards, deleteCard } from '../api/api';
import { useCollectionStore } from '../stores/collectionStore';
import ContentLoadedTransition from '../components/widgets/ContentLoadedTransition.vue';

const props = defineProps({
  id: String
});

const collectionStore = useCollectionStore();

const collectionName = computed(() => collectionStore.collectionMap[props.id]);


const cards = ref([]);

async function handleCardDelete(id, i){
  try{
    await deleteCard(id);
    cards.value.splice(i, 1);
  }catch(err){
    console.error(err);
  }finally{

  }
}
onMounted(async () => {
  try{
    const response_cards = await fetchCards(props.id);
    cards.value = response_cards;
    if(!collectionName.value){
      let name = await collectionStore.store_fetchCollectionById(props.id);
      collectionStore.setIdName(props.id, name);
    }
  }catch(err){
    console.error(err);
  }
})
</script>

<style scoped>
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
}
ul{
  list-style: none;
  display:grid;
  grid-template-columns: repeat(auto-fit, 35ch);
  margin: 0;
  margin-top: 2rem;
  gap: 3rem;
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