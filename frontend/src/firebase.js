// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const prodConfig = {
  apiKey: "AIzaSyCfQqF9O2rS9KczKSAEPxcaZ2XSDfIZE0c",
  authDomain: "knouns-prod.firebaseapp.com",
  projectId: "knouns-prod",
  storageBucket: "knouns-prod.firebasestorage.app",
  messagingSenderId: "757729926600",
  appId: "1:757729926600:web:c5b9054b03faf4d9f6f4fd"
}

const devConfig = {
  apiKey: "AIzaSyCbyaUspXLCy6XYgW5JXqbN4M_uB4C-h2o",
  authDomain: "auth-e4e28.firebaseapp.com",
  projectId: "auth-e4e28",
  storageBucket: "auth-e4e28.firebasestorage.app",
  messagingSenderId: "609030062856",
  appId: "1:609030062856:web:88ee5d9583b6a2afcba2bd",
  measurementId: "G-X05YCT343T"
}

const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:              import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);