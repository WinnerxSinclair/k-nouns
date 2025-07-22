<template>
  <div class="flex col">
    <label :for="label">{{ label }}</label>
    <input class="fs-500" :id="label" :type="type" required v-model="model" :maxlength="maxLen">
    <ErrorRender :errors="errors" />
  </div>
</template>

<script setup>
import ErrorRender from './widgets/ErrorRender.vue';
const props = defineProps({
  label: String,
  type: String,
  maxLen: Number,
  errors: Array
});

const model = defineModel();
</script>