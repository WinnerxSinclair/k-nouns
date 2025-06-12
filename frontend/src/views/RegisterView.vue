<template>
  <div class="flex col ac">
    <TheHeader header="케이-나운즈에 오신 것을 환영합니다!" />
    <TheForm :fields="fields" :rt="true" @submit="handleSubmit"/>
    <div class="mt-3">Have Account? <RouterLink to="/login">Login Here</RouterLink></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore.js';
import TheForm from '../components/TheForm.vue';
import TheHeader from '../components/TheHeader.vue';
import router from '../router'
let authStore = useAuthStore();

const validations = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    ui_pattern: /^[^\s@]+@[^\s@]+\.(com|net|org|edu|gov)$/i,
    messages: {
      required: 'Email is required',
      pattern: 'Invalid email format'
    }
  },
  password: {
    required: true,
    pattern: /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
    ui_pattern: /^(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
    messages: {
      required: 'Password is required',
      pattern: 'Too weak'
    }
  },
  re_password: {
    required: true,

    messages: {
      required: 'Confirm password is required',
    }
  }

}
const fields = [
  { name: 'email', label: 'Email', type: 'text', validation: validations.email },
  { name: 'password', label: 'Password', type: 'password', validation: validations.password },
  { name: 're_password', label: 'Confirm Password', type: 'password', validation: validations.re_password }
];

async function handleSubmit(formData) {
  try {
    // call the store’s login action
    await authStore.register(formData.email, formData.password)
    router.push('/check-email');
  } catch (err) {
    console.error('Login failed', err)
    // you can surface an error message here
  }
}

</script>