<template>
  <ModalTransition>
    <TheOverlay v-if="show" @close="handleHide">
      <slot />
    </TheOverlay>
  </ModalTransition>
</template>

<script setup>
import ModalTransition from './widgets/ModalTransition.vue';
import TheOverlay from './widgets/TheOverlay.vue';


const emit = defineEmits(['hide'])
const props = defineProps({
  show: Boolean,
  lock: { type: Boolean, default: false },
});

function handleHide(){
  // if(!props.lock) emit('hide');
  emit('hide');
}
</script>

<style scoped>

</style>