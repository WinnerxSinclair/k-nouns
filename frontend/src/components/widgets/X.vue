<template>
  <button class="x" @click="$emit('pressed')"></button>
</template>

<script setup>
const emit = defineEmits(['pressed'])
</script>
<style scoped>
.x{
  position: absolute;
  top: 5px;
  right: 5px;
  width: 60px;
  aspect-ratio: 1;
  padding: 0;
  background: transparent;
}
.x::before, .x::after{
  content:'';
  background:white;
  position:absolute;
  left: 50%;
  top: 50%;
  width: 5px;
  height: 100%;
}
.x::before{
  transform: translate(-50%, -50%) rotate(45deg);
}
.x::after{
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>