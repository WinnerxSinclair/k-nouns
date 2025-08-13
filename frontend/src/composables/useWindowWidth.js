import { ref, onMounted, onUnmounted, computed } from 'vue'

export function useWindowSize(){
  const width = ref(0);

  const update = () => {
    width.value = window.innerWidth;
  }

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onUnmounted(() => window.removeEventListener('resize', update));

  return {
    width,
    isMobile: computed(() => width.value <= 950)
  }
}