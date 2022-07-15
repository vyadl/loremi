<script setup lang="ts">
const props = defineProps({
  title: String,
  type: String,
  disabled: Boolean,
  active: Boolean,
  big: Boolean,
  small: Boolean,
  unbordered: Boolean,
  tag: Boolean,
});
const emit = defineEmits(['click', 'submit']);
</script>

<template>
  <button
    class="app-button"
    :class="{
      active,
      small,
      big,
      unbordered,
      tag,
    }"
    :disabled="disabled"
    :type="type === 'submit' ? 'submit' : 'button'"
    @click="$emit(type === 'submit' ? 'submit' : 'click')"
  >
    {{ title }}
  </button>
</template>

<style scoped lang="scss">
.app-button {
  border: 1px solid #444;
  border-radius: 2px;
  background: #fff;
  padding: 10px 15px;
  line-height: 1.1;
  font-size: 16px;
  opacity: .8;
  letter-spacing: .3px;
  transition: opacity .2s, color .2s, background .2s, border .2s;
  &:hover,
  &:active,
  &:focus {
    opacity: 1;
  }
  &.active {
    background: #444;
    color: #fff;
  }
  &.unbordered {
    border-color: transparent;
  }
  &.tag {
    border-radius: 20px;
    padding: 8px 18px;
  }
  &:disabled {
    opacity: .5;
    border-color: transparent;
    &:hover,
    &:active,
    &:focus {
      opacity: .5;
    }
  }
  &:not(:disabled) {
    cursor: pointer;
  }
}
</style>