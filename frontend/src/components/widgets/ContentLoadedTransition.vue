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
  transition: opacity 1s ease;
}
</style>