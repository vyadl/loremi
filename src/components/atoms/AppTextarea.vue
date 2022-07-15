<script setup lang="ts">
const props = defineProps({
  modelValue: String,
  title: String,
  required: Boolean,
  disabled: Boolean,
  thick: Boolean,
  cols: {
    type: Number,
    default: 30,
  },
  rows: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits({
  'update:modelValue': null,
});

function handleInputChange(event: Event) { 
  return (event.target as HTMLTextAreaElement).value;
}
</script>

<template>
  <label
    class="app-textarea"
    :class="{
      thick,
    }"
  >
    <div
      v-if="title"
      class="title"
    >
      {{ title }}
    </div>
    <textarea
      class="textarea"
      :cols="cols"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :value="modelValue"
      @input="$emit('update:modelValue', handleInputChange($event))"
    ></textarea>
  </label>
</template>

<style scoped lang="scss">
.app-textarea {
  display: block;

  --border-width: 1px;
  --border-radius: 5px;
  --padding-left: 15px;
  &.thick {
    --border-width: 2px;
    --border-radius: 10px;
  }
  .textarea {
    display: block;
    width: 100%;
    padding: var(--padding-left);
    border: var(--border-width) solid #555;
    border-radius: var(--border-radius);
    transition: border .2s;
    font-size: 16px;
    font-family: inherit;
    resize: none;
    &:focus {
      outline: none;
      border-color: #222;
    }
  }
  .title {
    font-size: 16px;
    margin-bottom: 10px;
    letter-spacing: 1px;
    padding-left: calc(var(--border-width) + var(--padding-left));
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
}
</style>