<template>
  <Transition name="content">
    <slot></slot>
  </Transition>
</template>


<style scoped>
.content-enter-from, .content-leave-to{
  opacity: 0;
}
.content-enter-active, .content-leave-active{
  transition: opacity .75s ease-in-out;
}
</style>