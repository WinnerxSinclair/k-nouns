<template>
  <div class="loader"></div>
</template>



<style scoped>
.loader {
  width: 25px;
  aspect-ratio: 1;
  border: 4px solid #000000;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
} 
</style>