<template>
  <div class="flex col">
    <label v-if="label">{{ label }}</label>
    
    <div class="flex ac jc rel">
      <input 
        :type=type 
        v-model="model" 
        @input="$emit('check')" 
        @blur="$emit('blur')"
      >
      <svg v-if="rt && valid" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#75FB4C"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
    </div>
    <div v-if="errMsg" class="err-msg">ⓘ {{ errMsg }}</div>
    
  </div>
</template>

<script setup>
const model = defineModel();
const props = defineProps({
  type: String,
  label: String,
  valid: Boolean,
  errMsg: {default: null},
  rt: Boolean
})
const emit = defineEmits(['check', 'blur'])
</script>

<style scoped>
input{
  width: 100%;
  font-size: 1.2rem;
}

svg{
  position: absolute;
  right: 5px;
}
label{
  font-size: 1.2rem;
  font-weight: 400;
}
.err-msg{
  width: fit-content;
  padding: 0 .5rem;

  font-size: 1rem;
  margin-top: 0.25rem;
}
</style>