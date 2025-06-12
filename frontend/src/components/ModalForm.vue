<template>
  <ModalTransition>
    <TheOverlay :isModal="true" v-if="show" @click="$emit('hide')">
      <form @submit.prevent="emitSubmit">
        <div class="flex col gap">
          <label>{{ label }}</label>
          <input class="fs-500" v-focus type="text" v-model="name">
        </div>
        <button class="mt-3" :disabled="name === ''">Create</button>
      </form>
    </TheOverlay>
  </ModalTransition>
</template>

<script setup>
import ModalTransition from './widgets/ModalTransition.vue';
import TheOverlay from './widgets/TheOverlay.vue';
import { ref } from 'vue'
import { vFocus } from '../directives/vFocus.js';

const emit = defineEmits(['hide', 'submit'])
const props = defineProps({
  label: { type: String, default: 'Name' },
  show: Boolean
});
const name = ref('');

function emitSubmit(){
  let payload = name.value;
  name.value = '';
  emit('submit', payload);
}
</script>

<style scoped>
form{
  padding: 1.2rem;
  background:white;
  border-radius: 1rem;
}
</style>