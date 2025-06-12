// stores/auth.js
import { defineStore } from 'pinia'
import { auth } from '../firebase.js'                       // your firebase.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from 'firebase/auth'

import { ref } from 'vue'
export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref(null)
  const isReady = ref(false);
  // actions
  function init() {
    return new Promise(resolve => {
      onAuthStateChanged(auth, u => {
        user.value = u
        isReady.value = true
        resolve()
      })
    })
  }

  async function register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user, {
      url: window.location.origin + '/verify-email',  
      handleCodeInApp: true   // optional but recommended for SPA flows
    })
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  return { user, init, register, login, logout, isReady }
})
