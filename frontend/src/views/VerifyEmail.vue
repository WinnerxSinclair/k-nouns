<template>
  <div>
    <h2>Email Verification</h2>
    <p v-if="status === 'loading'">Verifying…</p>
    <p v-else-if="status === 'success'">Email verified! You can now log in.</p>
    <p v-else-if="status === 'expired'">This link has expired or is invalid.</p>
    <p v-else>Error verifying your email.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth, applyActionCode } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useRoute, useRouter } from 'vue-router'

const status = ref('loading')
const route  = useRoute()
const router = useRouter()

onMounted(async () => {
  const oobCode = route.query.oobCode
  if (!oobCode) return (status.value = 'error')

  try {
    await applyActionCode(auth, oobCode)
    status.value = 'success'
    
    await auth.currentUser?.reload();
    await auth.currentUser?.getIdToken(true);
    setTimeout(() => router.push('/create'), 3000)
  } catch (err) {
    if (err.code === 'auth/expired-action-code') {
      status.value = 'expired'
    } else {
      status.value = 'error'
    }
  }
});
</script>
