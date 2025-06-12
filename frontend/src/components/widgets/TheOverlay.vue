<template>
  <div class="outer" :class="{'modal-bg': isModal}">
    <div class="inner" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isModal: Boolean
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
}

.modal-bg{
  background:rgba(0, 0, 0, 0.384);
  backdrop-filter: blur(5px);
}


</style>