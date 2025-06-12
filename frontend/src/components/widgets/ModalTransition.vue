<template>
  <Transition name="modal">
    <slot></slot>
  </Transition>
</template>
  
<style >
.modal-enter-active, .modal-leave-active{
  transition: opacity .2s ease-in-out;
}
.modal-enter-from, .modal-leave-to{
  opacity: 0;
}
.modal-enter-active .inner, .modal-leave-active .inner{
  transition: transform .2s ease-in-out;
}
.modal-enter-from .inner, .modal-leave-to .inner{
  transform: translateX(-200px);
}
</style>