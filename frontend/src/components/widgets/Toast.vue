<template>
  <TransitionGroup name="toast" tag="div" class="toast-stack">
    <div v-for="t in toastStore.toasts" :key="t.id" class="toast">
      {{ t.text }}
    </div>
  </TransitionGroup>
</template>

<script setup>
import { useToastStore } from '../../stores/toastStore.js';
const toastStore = useToastStore();
</script>

<style scoped>

.toast-stack{
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}
.toast-enter-active, .toast-leave-active{
  transition: all .5s ease;
}

.toast-enter-from, .toast-leave-to{
  opacity: 0;
  transform: translateY(-25px);
}
</style>