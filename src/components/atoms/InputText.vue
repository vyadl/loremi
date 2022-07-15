<script setup lang="ts">
const props = defineProps({
  title: String,
  type: {
    type: String,
    default: 'text',
  },
  modelValue: [Number, String],
  min: Number,
  max: Number,
  required: Boolean,
  disabled: Boolean,
  center: Boolean,
});
const emit = defineEmits({
  'update:modelValue': null,
});

function handleInputChange(event: Event) { 
  return (event.target as HTMLInputElement).value;
}
</script>

<template>
  <label
    class="input-text"
    :class="{ center }"
  >
    <div class="title">
      {{ title }}
    </div>
    <input
      :type="type"
      class="input"
      :min="min"
      :max="max"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @input="$emit('update:modelValue', handleInputChange($event))"
    >
  </label>
</template>

<style scoped lang="scss">
.input-text {
  display: inline-block;
  &.center {
    text-align: center;
    .input {
      text-align: center;
    }
  }
  .input {
    border: none;
    border-bottom: 1px solid #555;
    transition: border .2s;
    font-size: 20px;
    letter-spacing: .5px;
    &:focus {
      outline: none;
      border-color: #222;
    }
  }
  .title {
    font-size: 16px;
    margin-bottom: 10px;
    letter-spacing: 1px;
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