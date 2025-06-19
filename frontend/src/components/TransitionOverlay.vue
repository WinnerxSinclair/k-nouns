<template>
  <ModalTransition>
    <TheOverlay :isModal="true" v-if="show" @click="$emit('hide')">
      <slot />
    </TheOverlay>
  </ModalTransition>
</template>

<script setup>
import ModalTransition from './widgets/ModalTransition.vue';
import TheOverlay from './widgets/TheOverlay.vue';


const emit = defineEmits(['hide'])
const props = defineProps({
  show: Boolean
});



</script>

<style scoped>

</style>