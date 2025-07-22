<template>
  <div class="outermost">
    <AppHeader />
  
    <main class="grow rel">
      <Toast />
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/header/AppHeader.vue';
import Toast from './components/widgets/Toast.vue';




</script>

<style scoped>
.outermost{
  height: 100%;
  display:flex;
  flex-direction: column;
}

main{
  display:flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
}
</style>
