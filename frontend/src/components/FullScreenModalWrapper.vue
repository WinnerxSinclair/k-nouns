<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style scoped>
.wrapper{
  z-index: 2;
  width: 100%;
  background: rgb(255, 253, 247);
  min-height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>