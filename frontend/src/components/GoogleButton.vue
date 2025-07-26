<template>
  <button class="flex ac jc gap google-btn" @click="handleClick">
    <img class="icon" src="../assets/g.webp" alt="">
    <span>Continue With Google</span>
  </button>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore.js';
import { ref } from 'vue'
import { useAsyncTask } from '../composables/useAsyncTask.js';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const { loading, error, run } = useAsyncTask();
async function handleClick(){
  await run(async () => {
    await authStore.googleSignin();
    router.push('/create');
  });
}
</script>

<style scoped>
.google-btn{
  background: white;
  border: 1px solid black;
  width: 100%;
  padding: .5em 0;
  border-radius: .2rem;
}
.google-btn:hover{
  background: rgb(228, 228, 228);
}
.icon{
  width: 25px;
}
</style>