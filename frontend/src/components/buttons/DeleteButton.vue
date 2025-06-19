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
  cursor: pointer;
  background: rgb(255, 243, 243);
  color:red;
  border: 1px solid rgb(255, 182, 182);
}
</style>

