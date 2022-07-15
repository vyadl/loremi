<script setup lang="ts">
  import { useMainStore } from '@/stores/main';

  const store = useMainStore();
  
</script>
<template>
  <header class="app-header">
    <div class="logo">
      markovka
    </div>
  </header>
</template>

<style lang="scss">
.app-header {
  .logo {
    font: 42px Tahoma;
    color: #444;
    letter-spacing: 5px;
    text-align: center;
    margin-bottom: 32px;
    padding-top: 20px;
  }
}
</style>