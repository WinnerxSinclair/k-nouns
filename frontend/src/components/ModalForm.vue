<template>
  <ModalTransition>
    <TheOverlay :isModal="true" v-if="show" @click="handleHide">
      <form @submit.prevent="emitSubmit">
        <div class="flex col gap">
          <label>{{ label }}</label>
          <input class="fs-500" v-focus :type="type" v-model="name" :disabled="lock">
        </div>
        <ErrorRender :errors="errors" />
        <button class="mt-3" :disabled="lockButton">{{ btnText }}</button>
      </form>
    </TheOverlay>
  </ModalTransition>
</template>

<script setup>
import ModalTransition from './widgets/ModalTransition.vue';
import TheOverlay from './widgets/TheOverlay.vue';
import ErrorRender from './widgets/ErrorRender.vue';
import { ref, watch, computed } from 'vue'
import { vFocus } from '../directives/vFocus.js';

const emit = defineEmits(['hide', 'submit']);
const props = defineProps({
  label: { type: String, default: 'Name' },
  show: Boolean,
  prefill: { type: String, default: '' },
  btnText: { type: String, default: 'Create' },
  type: { type: String, default: 'text' },
  lock: { type: Boolean, default: false },
  submitting: { type: Boolean, default: false },
  maxLen: { type: Number },
  errors: { type: Array, default: [] }
});

const name = ref(null);
const lockButton = computed(() => {
  return props.lock || props.submitting;
})

watch(() => props.show, (v) => {
  if(v) name.value = props.prefill ?? null
});

function emitSubmit(){
  let payload = name.value;
  name.value = null;
  emit('submit', payload);
}

function handleHide(){
  if(!props.lock) emit('hide');
}
</script>

<style scoped>
form{
  padding: 1.2rem;
  background:white;
  border-radius: 1rem;
}
</style>