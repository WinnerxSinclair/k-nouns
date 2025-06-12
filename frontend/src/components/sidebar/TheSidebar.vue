<template>
  <div class="sidebar flex col">
    <h1 class="tac">생신</h1>
    
    
    <nav class="pad flex col jsb grow">
      <div class="top-nav">
        
        <div v-if="!authStore.user">
          <RouterLink to="/login">Login</RouterLink>
          /
          <RouterLink to="/register">Signup</RouterLink>
        </div>
        
        <div v-else>
          <button @click="authStore.logout">Logout</button>         
        </div>

        <div>
          <img src="" alt="">
          <RouterLink to="/dashboard">Dashboard</RouterLink>
        </div>
        <div>
          <img src="" alt="">
          <RouterLink to="/login">Study</RouterLink>
        </div>
      </div>

      <div class="bot-nav flex col gap-4">
        <div>
          <img src="" alt="">
          <RouterLink to="/login">Prebuilt Colls</RouterLink>
        </div>
        <div>
          <img src="" alt="">
          <RouterLink to="/login">Prebuilt Convos</RouterLink>
        </div>
        <div>
          <img src="" alt="">
          <RouterLink to="/login">About</RouterLink>
        </div>
        <div class="flex jc">
          <button>D</button>
          <button>BS</button>
          <button>FB</button>
        </div>
      </div>

    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

import { useAuthStore } from '../../stores/authStore.js';
import router from '../../router'

const authStore = useAuthStore();

</script>

<style scoped>
a{
  text-decoration: none;
  color: inherit;
  font-size: 1.2rem;
  padding: .2rem .5rem;
  border-radius: 1rem;
}
a:hover{
  background:white;
  color:var(--text-color);
}

.top-nav > :not(:first-child){
  margin-top: 2rem;
}
.top-nav > :nth-child(2){
  margin-top: 5rem;
}

.bot-nav > :nth-last-child(2){
  margin-bottom: 1rem;
}
.sidebar{
  min-height: 100vh;
}
</style>

