<template>
  <div class="flex col mt-3">
    <label>{{ label }}</label>
    <textarea 
      v-autosize 
      name="" id="" 
      :placeholder="placeholder" 
      v-model="model"
      :required="required"
    >
    </textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  required: { type: Boolean, default: false }
});

const model = defineModel();
</script>

<style scoped>
textarea{
  min-height: 60px;
  font-size: 1rem;
}
</style>