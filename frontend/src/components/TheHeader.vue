<template>
  <h1 class="header">{{ header }}</h1>
</template>

<script setup>
const props = defineProps({
  header: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.header{
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>