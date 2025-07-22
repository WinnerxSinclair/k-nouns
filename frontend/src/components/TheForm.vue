<template>
  <form @submit.prevent="submitForm" class="flex col gap">
    <slot />
    <button class="btn-main">{{ btnMsg }}</button> 
  </form>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  btnTxt: { type: String, default: 'Login' },
  submitting: { type: Boolean, default: false },
  submittingMsg: String
});

const emit = defineEmits(['submit']);

const btnMsg = computed(() => props.submitting ? props.submittingMsg : props.btnTxt);
function submitForm(){
  emit('submit');
}

</script>

<style scoped>
form{
  width: 100%;
  border-radius: 1rem; 
}
</style>