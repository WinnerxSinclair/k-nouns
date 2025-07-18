<template>
  <div>
    <div class="err" v-for="(err) in noRepeats" :key="err">{{ err }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  errors: Array
});

const noRepeats = computed(() => Array.from(new Set(props.errors)));
</script>
