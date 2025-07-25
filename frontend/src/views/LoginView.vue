<template>
  
  <TheHeader header="Welcome!" />
  <div class="flex col ac gap form-wrap">
    <TheForm @submit="handleSubmit" :submitting="submitting" submittingMsg="Logging in...">
      <Input 
        type="email" 
        label="Email" 
        v-model="form.email"
      />
      <Input 
        type="password" 
        label="Password" 
        v-model="form.password"
      />
    </TheForm>
    <div v-if="invalidCredentials">Invalid Credentials</div>

    <div class="flex ac jc w-100">
      <div class="line"></div>
      <div>OR</div>
      <div class="line"></div>
    </div>

    <GoogleButton />
  
    <div class="mt-3">No Account? <RouterLink to="/register">Sign up Here</RouterLink></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore.js';
import TheForm from '../components/TheForm.vue';
import Input from '../components/Input.vue';
import TheHeader from '../components/TheHeader.vue';
import GoogleButton from '../components/GoogleButton.vue';
import { loginSchema } from '@zod/auth.js';
import { validateNoRender } from '../helpers/validate.js';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'vue-router';
const router = useRouter();
const form = ref({
  email: '',
  password: '',
});


const submitting = ref(false);
const invalidCredentials = ref(false);
let authStore = useAuthStore();

async function handleSubmit() {
  if(submitting.value) return;
  submitting.value = true;
  invalidCredentials.value = false;
  try {
    if(!validateNoRender(form.value, loginSchema)){
      invalidCredentials.value = true;
      return;
    }
    await authStore.login(form.value.email, form.value.password);
    router.push('/decks');
  } catch (err) {
    if(err instanceof FirebaseError){
      invalidCredentials.value = true;
    }
    console.error('Login failed', err)
  }finally{
    submitting.value = false;
  }
}

</script>

<style scoped>

.form-wrap{
  width: clamp(350px, 100%, 400px);
  margin: 0 auto;
  padding: 1rem;
}
</style>

