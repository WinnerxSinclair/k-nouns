<template>
  <div 
    ref="dialog" 
    class="outer"
    @click.self="$emit('close')" 
    role="dialog" aria-modal="true" 
    @keydown.esc="$emit('close')"
  >
    <div class="inner">
      <slot />
    </div>
    <X  @pressed="$emit('close')" />
  </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, useTemplateRef } from 'vue'
import X from './X.vue';
const emit = defineEmits(['close']);
const dialog = useTemplateRef('dialog');

let focusables;
let firstEl;
let lastEl;
let opener;
const trap = (e) => {
  if (e.key !== 'Tab') return 
  if (e.shiftKey && e.target === firstEl) {        
    e.preventDefault()
    lastEl.focus()
  } else if (!e.shiftKey && e.target === lastEl) { 
    e.preventDefault()
    firstEl.focus()
  }
}

const FOCUSABLE = `
  a[href], area[href], input:not([disabled]):not([type="hidden"]),
  select:not([disabled]), textarea:not([disabled]),
  button:not([disabled]), iframe, object, embed,
  [tabindex]:not([tabindex="-1"]), [contenteditable="true"]
`;

onBeforeMount(() => {
  opener = document.activeElement;
});

onMounted(() => {
  focusables = dialog.value.querySelectorAll(FOCUSABLE);
  if (focusables.length === 0) return;
  firstEl = focusables[0];
  lastEl  = focusables[focusables.length - 1];
  firstEl.focus();
  dialog.value.addEventListener('keydown', trap);
});

onBeforeUnmount(() => {
  dialog.value.removeEventListener('keydown', trap);
});

onUnmounted(() => {
  opener?.focus();
})
</script>

<style scoped>
.outer{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
  z-index:99;
  background:rgba(0, 0, 0, 0.384);
  backdrop-filter: blur(5px);
}

</style>