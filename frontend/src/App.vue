<template>
  <div class="outermost">
    <TheSidebar />

    <main class="grow rel">
      <Toast />
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import TheSidebar from './components/sidebar/TheSidebar.vue';
import Toast from './components/widgets/Toast.vue';
import { useToastStore } from './stores/toastStore.js';

const toastStore = useToastStore();
</script>

<style scoped>
.outermost{
  display:flex;
  height: 100%;
}
.sidebar{
  background:rgb(17, 19, 46);
  color:white;
  height: 100%;
}
main{
  margin-top: 4vh;
}
</style>
