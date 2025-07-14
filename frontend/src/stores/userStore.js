import { defineStore } from "pinia";
import { ref,computed } from 'vue'
import { checkTokens } from "../api/api.js";
export const useUserStore = defineStore('user', () => {
  const tokens = ref(null);
  const hasEnough = computed(() => tokens.value > 0)
  async function fetchTokens(){
    try{
      const res = await checkTokens();
      tokens.value = res.tokensUsed;
      return res.tokensUsed;
    }catch(err){
      console.error(err);
    }
  }
  
  function updateTokenCount(n){
    tokens.value = n;
  }
  
  return{
    tokens,
    hasEnough,
    updateTokenCount,
    fetchTokens
  }
});