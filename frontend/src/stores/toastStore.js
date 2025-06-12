import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  function createToast(text){
    let id = crypto.randomUUID();
    let toast = {
      text,
      id,
    };
    toasts.value.push(toast);
    setTimeout(() => removeToast(id), 3000);
  }

  function removeToast(id){
    let idx = toasts.value.findIndex((toast) => toast.id === id);
    if(idx === -1) return;
    toasts.value.splice(idx, 1);
  }

  return {
    toasts,

    createToast
  }
})