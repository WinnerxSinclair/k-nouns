<template>
  <div class="confirm-root flex col jsb">
    <div>
      <h2>{{ heading }}</h2>
      <div>{{ message }}</div>
      <div v-if="lock">{{ lockMessage }}</div>
    </div> 
    <div class="flex jsb">
      <button :disabled="lock" type="button" @click="$emit('confirm')" class="c-btn confirm-btn">Confirm</button>
      <button :disabled="lock" type="button" @click="$emit('cancel')" class="c-btn cancel-btn">Cancel</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  heading: String,
  message: { type: String, default: 'Confirm?'},
  lock: { type: Boolean, default: false },
  lockMessage: { type: String, default: 'loading' }
});
const emit = defineEmits(['cancel', 'confirm'])
</script>

<style scoped>
.confirm-root{
  padding: 1rem 2rem ;
  background: white;
  border-radius: 1rem;
  min-height: 175px;
  max-width: 350px;
}

.c-btn{
  cursor: pointer;
}
.confirm-btn{
  color: green;
  border: 1px solid green;
  background: rgba(189, 252, 164, 0.103);
}
.cancel-btn{
  color: red;
  border: 1px solid red;
  background: rgba(247, 173, 173, 0.103);
  
}
</style>