<template>
  <div class="header">
    <div class="inner-header">
      <div class="flex ac gap menu-wrap">
        <button class="pad-0 menu-btn" @click="mobileMenuToggle = !mobileMenuToggle">
          <svg class="menu" xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="#ffffff"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
        </button>
        
        <svg class="logo" width="43" height="24" viewBox="0 0 43 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.474 11.616L21.222 24H13.77L7.056 13.83V24H0.792V0.239999H7.056V9.528L13.176 0.239999H20.232L12.474 11.616ZM25.324 5.946L25.792 6.036V24H19.528V0.239999H28.024L36.61 18.168L36.16 18.258V0.239999H42.406V24H33.874L25.324 5.946Z" fill="#ffffff"/>
        </svg>
       
      </div>
  
      <nav class="pad flex jsb grow nav">
        <div class="main-nav">        
          <RouterLink to="/dashboard">

            Dashboard
          </RouterLink>
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
import { useUserStore } from '../../stores/userStore.js';
import { useDeckStore } from '../../stores/deckStore.js';
import { useRoute } from 'vue-router';
const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();
const deckStore = useDeckStore();

function resetStores(){
  userStore.$reset();
  deckStore.$reset();
}

const mobileMenuToggle = ref(false);
watch((route), () => {
  mobileMenuToggle.value = false;
})
async function handleLogout(){
  try{
    await authStore.logout();
    resetStores();
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
  user-select: none;
}
a:hover{
  background:white;
  color:var(--text-color);
}
.main-nav{
  display: flex;
  gap: 2rem;
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

.logo{
  /* font-family: 'League Spartan';
  letter-spacing: -4px;
  font-weight: 700;
  font-size: 3rem; */

  margin-right: 5vw;
  margin-left: .4rem; 
  
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

.menu-btn{
  display: none;
}
@media(max-width: 650px){
  .nav{
    display: none;
  }
  .menu-btn{
    display: block;
  }
}
</style>

