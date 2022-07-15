<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
  },
  center: {
    type: Boolean,
    default: false,
  }
});

</script>

<template>
<div
  class="setting-block"
  :class="{ center }"
>
  <div class="title">
    {{ title }}
  </div>
  <div class="body">
    <slot />
  </div>
</div>

</template>

<style lang="scss" scoped>
.setting-block {
  border: 2px solid #555;
  border-radius: 2px;
  padding: 20px;
  margin-bottom: 20px;
  &.center {
    text-align: center;
    .body {
      text-align: center;
    }
  }
  .title {
    position: absolute;
    top: -17px;
    background: #fff;
    padding: 5px;
    font-size: 18px;
    margin-bottom: 5px;
    line-height: 1.1;
    letter-spacing: 1px;
    text-align: center;
    font-weight: bold;
  }
}
</style>
