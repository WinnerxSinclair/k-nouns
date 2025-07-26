<template>
  <div @click.stop
    class="outer"
  >
    <div class="inner">
      <slot />
    </div>
  </div>
</template>



<style scoped>
.outer{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
  z-index:99;
  /* background:rgba(0, 0, 0, 0.384);
  backdrop-filter: blur(5px); */
}

</style>