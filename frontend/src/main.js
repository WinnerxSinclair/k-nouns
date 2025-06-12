import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import autoResize from './directives/autoResize'
import router from './router'
import { useAuthStore } from './stores/authStore'


const app = createApp(App);
app.directive('autosize', autoResize);


app.use(createPinia());

const authStore = useAuthStore();
await authStore.init();

app.use(router);
app.mount('#app')
