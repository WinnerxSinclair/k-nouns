// stores/auth.js
import { defineStore } from 'pinia'
import { auth } from '../firebase.js'                       // your firebase.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider
} from 'firebase/auth'

import { ref } from 'vue'
export const useAuthStore = defineStore('auth', () => {
  // state
  const user = ref(null)

  // actions
  function init() {
    return new Promise(resolve => {
      onAuthStateChanged(auth, u => {
        user.value = u
        resolve()
      })
    })
  }

  async function register(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user, {
      url: window.location.origin + '/verify-email',  
      handleCodeInApp: true   
    })
  }

  function login(email, password) {
     return signInWithEmailAndPassword(auth, email, password)
  }

  async function googleSignin(){
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  function logout() {
    return signOut(auth);
  }

  return { user, init, register, login, logout, googleSignin }
})
