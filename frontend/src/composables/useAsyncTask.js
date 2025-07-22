import { ref } from 'vue'

export function useAsyncTask(){
  const loading = ref(false);
  const error = ref(null);
  const result = ref(null);

  async function run(task){
    if(loading.value) return;
    loading.value = true;
    try{
      const res = await task();
      result.value = res;
      return res;
    }catch(err){
      error.value = err;
      console.error(err);
    }finally{
      loading.value = false;
    }
  }

  return { loading, run, error, result }
}