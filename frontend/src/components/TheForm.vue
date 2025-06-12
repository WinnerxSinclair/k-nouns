<template>
  <form @submit.prevent="submitForm" class="flex col gap">
    <TheInput 
      v-for="(field, i) in fields" :key="field.name"
      :label="field.label"
      :type="field.type"
      v-model="formValues[field.name]"
      @check="validate(field.name, i)"
      @blur="blurValidate(field.name)"
      :valid="errorUI[field.name]"
      :errMsg="errorMsgs[field.name]"
      :rt="rt"
      >
  
    </TheInput>
    <button>Login</button> 
  </form>
</template>

<script setup>
import TheInput from '../components/TheInput.vue';
import { ref, computed } from 'vue'

const props = defineProps({
  fields: Array,
  rt: Boolean
});

const emit = defineEmits(['submit'])
const formValues = ref(
  props.fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {})
);

const errorUI = ref(
  props.fields.reduce((acc, field) => {
    acc[field.name] = false;
    return acc;
  }, {})
);

const errorMsgs = ref(
  props.fields.reduce((acc, field) => {
    acc[field.name] = '';
    return acc;
  }, {})
);

const hasErrors = computed(() => {
  return Object.values(errorMsgs.value).some(err => err !== '');
})


function blurValidate(name){
  const field = props.fields.find((f) => f.name === name);
  const value = formValues.value[name];

  if(!field.validation) return;

  if(field.validation.required && !value){
    errorMsgs.value[name] = field.validation.messages.required;
    return;
  }

  if(field.validation.pattern && !field.validation.pattern.test(value)){
    errorMsgs.value[name] = field.validation.messages.pattern;
    return;
  }

  if(name === 're_password' && value !== formValues.value.password){
    errorMsgs.value[name] = 'Passwords do not match';
    return;
  }

  errorMsgs.value[name] = '';

}


function submitForm(){
  props.fields.forEach(field => {
    blurValidate(field.name);
  });

    if(!hasErrors.value){
      emit('submit', { ...formValues.value });
    }
}
function validate(name, i){
  if(!props.fields[i].validation) return;
  let val = formValues.value[name];
  if(errorMsgs.value[name] !== '') blurValidate(name);
  if(name !== 're_password'){
    errorUI.value[name] = props.fields[i].validation?.ui_pattern?.test(val) ?? false;
    // errorMsgs.value[name] = errorUI.value[name] ? '' : errorMsgs.value[name];
  }else{
    errorUI.value[name] = (val === formValues.value.password && val !== '');
  }
  
}

</script>

<style scoped>
form{
  max-width: 450px;
  margin: 0 auto;
  border: 1px solid black;
  background: #ffec8d7e;
 
  padding: 2rem 5rem;
  border-radius: 1rem;
  
}

</style>