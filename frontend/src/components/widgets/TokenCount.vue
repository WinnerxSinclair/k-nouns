<template>
  <div class="flex ac gap-0 token-display">
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000"><g><rect fill="none" height="24" width="24"/></g><g><path d="M12,22c5.52,0,10-4.48,10-10S17.52,2,12,2S2,6.48,2,12S6.48,22,12,22z M13,4.07c3.94,0.49,7,3.85,7,7.93s-3.05,7.44-7,7.93 V4.07z"/></g></svg>
    <div class="tokens">{{ tokenCount }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  tokenCount: Number
});
</script>

<style scoped>
.token-display{
  border: 1px solid black;
  border-radius: 9em;
  padding: 0 .5rem 0 .2rem;
}
.tokens{
  line-height: 1.7;
}
</style>