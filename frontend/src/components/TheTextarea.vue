<template>
  <div class="flex col mt-3">
    <label :for="label">{{ label }}</label>
    <textarea 
      v-autosize
      
      :placeholder="placeholder" 
      v-model="model"
      :required="required"
      :maxLength="maxLength"
      :id="label"
    >
    </textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  placeholder: String,
  required: { type: Boolean, default: false },
  maxLength: { type: Number, default: 1500 }
});

const model = defineModel();
</script>

<style scoped>
textarea{
  min-height: 60px;
  font-size: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>