<template>
  <section v-if="deckStore.decks.length">
    <h2>Decks</h2>
    <ul class="flex col gap-0">
      <li class="flex ac gap-1" v-for="deck in deckStore.decks" :key="deck._id">
        <div class="rel">                  
          <button class="flex ac popupBtn pad-0" @click="$emit('popup', deck.name)">
            <svg class="block" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><g><rect fill="none" height="24" width="24"/><path d="M20,6h-8l-2-2H4C2.9,4,2.01,4.9,2.01,6L2,18c0,1.1,0.9,2,2,2h16.77c0.68,0,1.23-0.56,1.23-1.23V8C22,6.9,21.1,6,20,6z M20,18L4,18V6h5.17l2,2H20V18z M18,12H6v-2h12V12z M14,16H6v-2h8V16z"/></g></svg>
          </button>
          <div class="abs deck-tag-controls editPopup" v-if="selected">
            <h4>{{ `${deck.name}` }}</h4>
            <hr>
            <ul class="flex col gap">
              <li>
                <button @click="$emit('delete', deck._id, deck.name)">Delete Deck</button>
              </li>
              <li>
                <button @click="$emit('delete', deck._id, deck.name)">Rename Deck</button>
              </li>
              <li>
                <button @click="$emit('delete', deck._id, deck.name)">Export Deck</button>
              </li>
            </ul>
          </div>
        </div>
        
        <button 
          @click="addToQuery(deck._id, 'decks', $event)" 
          class="name-btn"
          :class="{ 'selected-query': querySets.decks.has(deck._id)}"
        >
          {{ deck.name }}
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  selected: Boolean
});

const emit = defineEmits(['popup', 'delete', 'rename', 'export']);
</script>