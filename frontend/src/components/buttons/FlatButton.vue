<template>
  <button 
    class="flat-btn" 
    :disabled="disabled" 
    :type="type"
    @click="$emit('pressed')"
  >
    {{ text }}
  </button>
</template>

<script setup>
const props = defineProps({
  disabled: { default: false },
  type: { type: String, default: 'submit' },
  text: { type: String, default: 'Submit' },
});

const emit = defineEmits(['pressed']);
</script>

<style scoped>
.flat-btn{
  background-color: var(--btn-bg-primary);
  color: var(--btn-color-primary);
  border: 1px solid black;
  border-radius: .2rem;
  cursor: pointer;
}
</style>

