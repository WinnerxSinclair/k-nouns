<template>
  <div class="sidebar flex ac">
    <h1 >생신</h1>
    
    
    <nav class="pad flex jsb grow">
     
        <div class="flex gap">        
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/login">Study</RouterLink>
          <RouterLink to="/create">Create</RouterLink>
        </div>
     
        <div>
          <div v-if="!authStore.user">
            <RouterLink to="/login">Login</RouterLink>
            /
            <RouterLink to="/register">Signup</RouterLink>
          </div>
          
          <div v-else>
            <button @click="authStore.logout">Logout</button>         
          </div>     
        </div>
    </nav>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';

import { useAuthStore } from '../../stores/authStore.js';
import router from '../../router/index.js'

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

h1{
  flex: 0 0 250px;
  padding-left: 1rem;
}
button{
  color: white;
}
</style>

