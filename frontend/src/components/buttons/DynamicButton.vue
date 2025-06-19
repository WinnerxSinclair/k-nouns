<template>
  <button
    class="pointer" 
    :class=styles 
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
  styles: { type: String, default: 'flat' }
});

const emit = defineEmits(['pressed']);
</script>

<style scoped>
.pointer{
  cursor: pointer;
}
.flat{
  background-color: var(--btn-bg-primary);
  color: var(--btn-color-primary);
  border: 1px solid black;
  border-radius: .2rem;
}
.delete{
  background: rgb(255, 243, 243);
  color:red;
  border: 1px solid rgb(255, 182, 182);
}
.edit{
  background: rgb(153, 174, 233);
  color:rgb(255, 255, 255);
  border: 1px solid rgb(155, 171, 243);
}
</style>

