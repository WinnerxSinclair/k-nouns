<template>
  <div class="flex col gap ac form-wrap">
    <TheHeader header="Welcome!" />
    <TheForm @submit="handleSubmit" btnTxt="Submit">
      <Input 
        type="email" 
        label="Email" 
        v-model="form.email"
        :errors="loginErrors.email" 
      />
      <Input 
        type="password" 
        label="Password" 
        v-model="form.password"
        :errors="loginErrors.password" 
      />
      
      <Input 
        type="password" 
        label="Confirm Password" 
        v-model="form.confirmPassword"
        :errors="loginErrors.confirmPassword" 
      />
    </TheForm>

    <div class="flex ac jc w-100">
      <div class="line"></div>
      <div>OR</div>
      <div class="line"></div>
    </div>

    <GoogleButton />
    <div class="mt-3">Have account? <RouterLink to="/login">Login Here</RouterLink></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore.js';
import TheForm from '../components/TheForm.vue';
import Input from '../components/Input.vue';
import TheHeader from '../components/TheHeader.vue';
import { signupSchema } from '@zod/auth.js';
import { validate } from '../helpers/validate.js';
import GoogleButton from '../components/GoogleButton.vue';
import router from '../router'
const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
});
const loginErrors = ref({
  email: [],
  password: [],
  confirmPassword: []
});

const pwRequirements = [
  'Minimum 8 characters', 
  'At least 1 uppercase and 1 lowercase', 
  'At least 1 number and 1 special character'
]
let authStore = useAuthStore();

async function handleSubmit() {
  try {
    if(!validate(form.value, loginErrors, signupSchema)) return;
    if(form.value.password !== form.value.confirmPassword){
      loginErrors.value.confirmPassword.push('Passwords do not match');
      return;
    }
    await authStore.register(form.value.email, form.value.password);
    router.push('/create')
  } catch (err) {
    console.error('Login failed', err)
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

