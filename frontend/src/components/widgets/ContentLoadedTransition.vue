<template>
  <Transition name="content">
    <slot></slot>
  </Transition>
</template>


<style scoped>
.content-enter-from{
  opacity: 0;
}
.content-enter-active{
  transition: opacity .75s ease-in-out;
}
</style>