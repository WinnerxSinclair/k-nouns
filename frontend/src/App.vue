<template>
  <div class="outermost">
    <TheHeader />
  
    <main class="grow rel">
      <Toast />
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import TheHeader from './components/header/TheHeader.vue';
import Toast from './components/widgets/Toast.vue';
import { useToastStore } from './stores/toastStore.js';

const toastStore = useToastStore();
</script>

<style scoped>
.outermost{
  height: 100%;
  display:flex;
  flex-direction: column;
}
.sidebar{
  background:rgb(17, 19, 46);
  color:white;
 
}
main{
  display:flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}
</style>
