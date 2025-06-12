<template>
  <div>
    <h1 class="tac">{{ collectionName }}</h1>
    <div class="tac" v-show="collectionName">
      <RouterLink :to="`/collection/${id}/entry`" class="new-card-btn">New Card</RouterLink>
    </div>

    <ContentLoadedTransition>      
      <ul v-if="cards.length && collectionName">
        <li v-for="(card, i) in cards" :key="card._id">
          <p>{{ card.front }}</p>
          <img @click="handleCardDelete(card._id, i)" class="icon" src="../assets/delete.png" alt="">
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

const collectionName = computed(() => collectionStore.collectionMap[props.id]);

const collectionStore = useCollectionStore();
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
      console.log('lamow')
      let name = await collectionStore.store_fetchCollectionById(props.id);
      collectionStore.setIdName(props.id, name);
    }
  }catch(err){
    console.error(err);
  }
})
</script>

<style scoped>
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
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.301);;
  padding: .5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer; 
}
li:hover{
  background: rgb(202, 202, 202);
}
p{
  padding: 0 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon{
  --w: 25px;
  width: var(--w);
  min-width: var(--w);
  margin-right: 1rem;
  cursor: pointer;
  border-radius: 50%;
}
.icon:hover{
  background: rgb(117, 117, 117);
}
</style>