<template>
  <h1 class="header" :style="margins">{{ header }}</h1>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  header: {
    type: String,
    required: true
  },
  mTop: { type: Number, default: 1.5 },
  mBot: { type: Number, default: 2 },
});

const margins = computed(() => ({
  'margin-top': props.mTop + 'rem',
  'margin-bottom': props.mBot + 'rem'
}));
</script>

<style scoped>
.header{
  text-align: center;
}
</style>