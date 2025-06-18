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
  margin-top: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}
</style>