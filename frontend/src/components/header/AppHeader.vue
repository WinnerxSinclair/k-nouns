<template>
  <div class="header">
    <div class="inner-header">
      <div class="flex ac gap menu-wrap">
        <button class="pad-0" @click="mobileMenuToggle = !mobileMenuToggle">
          <svg class="menu" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
        </button>
        <div class="fs-700 title">두꺼비</div>
      </div>
  
      <nav class="pad flex jsb grow nav">
        <div class="flex gap">        
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/study">Study</RouterLink>
          <RouterLink to="/create">Create</RouterLink>
        </div>
      
        <div>
          <div v-if="!authStore.user">
            <RouterLink to="/login">Login</RouterLink>
            /
            <RouterLink to="/register">Signup</RouterLink>
          </div>
          
          <div v-else>
            <button @click="handleLogout">Logout</button>         
          </div>     
        </div>
      </nav>
    </div>
      <nav v-if="mobileMenuToggle" class="mobile-nav">
        <div>
          <div v-if="!authStore.user">
            <RouterLink to="/login">Login</RouterLink>
            /
            <RouterLink to="/register">Signup</RouterLink>
          </div>
          <div v-else>
            <button @click="handleLogout">Logout</button>         
          </div>  
        </div>

        <div class="flex col gap">        
          <RouterLink to="/dashboard">Dashboard</RouterLink>
          <RouterLink to="/study">Study</RouterLink>
          <RouterLink to="/create">Create</RouterLink>
        </div>
      </nav>
  </div>

  

</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore.js';
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const mobileMenuToggle = ref(false);
watch((route), () => {
  mobileMenuToggle.value = false;
})
async function handleLogout(){
  try{
    await authStore.logout();
    router.push('/login');
  }catch(err){
    console.error(err);
  }
}
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

button{
  color: white;
}
.header{
  background:rgb(17, 19, 46);
  color:white;
  position: relative;
}
.inner-header{
  margin: 0 auto;
  max-width: var(--app-max-w);
  display:flex;
  align-items: center;
}
.menu-wrap{
  margin-left: .4rem;
}
.title{
  margin-right: 5vw;
}

/* mobile */
.mobile-nav{
  background-color: var(--alt-bg);
  padding: 1rem;
  color: white;
  position: absolute;
  z-index: 1000;
  width: 100%;
}
.mobile-nav > :first-child{
  margin-bottom: 3rem;
}
.menu{
  display: none;
}

@media(max-width: 650px){
  .nav{
    display: none;
  }
  .menu{
    display: block;
  }
}
</style>

