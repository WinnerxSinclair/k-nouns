<template>
  <div :style="{'margin-top': margin + 'rem' }"></div>
</template>
<script setup>
const props = defineProps({
  margin: { type: Number, default: 1 }
})
</script>