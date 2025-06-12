<template>
  <div class="check-email">
    <h1>Almost there!</h1>
    <p>
      We’ve sent a verification link to your email address. <br/>
      Please check your inbox (and your spam folder) and click the link
      to complete your registration.
    </p>

    <!-- Resend section -->
    <button @click="resend" :disabled="sending">
      {{ sending ? 'Sending…' : 'Resend Verification Email' }}
    </button>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error"   class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getAuth, sendEmailVerification } from 'firebase/auth'
import { useRouter } from 'vue-router'

const auth     = getAuth()
const router   = useRouter()
const sending  = ref(false)
const error    = ref('')
const success  = ref('')

async function resend() {
  error.value   = ''
  success.value = ''
  sending.value = true

  // If they somehow got signed out, send them back to login
  if (!auth.currentUser) {
    error.value = 'Session expired — please log in again.'
    sending.value = false
    return router.push('/login')
  }

  try {
    await sendEmailVerification(auth.currentUser, {
      url: window.location.origin + '/verify-email',
      handleCodeInApp: true
    })
    success.value = 'Verification email resent! Check your inbox.'
  } catch (err) {
    console.error('Resend failed', err)
    error.value = 'Could not resend email. Please try again later.'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.check-email {
  max-width: 400px;
  margin: 2rem auto;
  text-align: center;
}
button {
  margin-top: 1em;
  padding: 0.5em 1em;
}
.success { color: green; }
.error   { color: red; }
</style>
