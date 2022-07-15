<script setup lang="ts">
const props = defineProps({
  title: String,
  modelValue: Number,
  min: Number,
  max: Number,
  step: Number,
  disabled: Boolean,
});
const emit = defineEmits(['update:modelValue']);

function handleInputChange(event: Event) { 
  return (event.target as HTMLInputElement).value;
}
</script>

<template>
  <label class="input-range">
    <div class="title">
      {{ title }}
    </div>
    <input
      type="range"
      class="input"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="$emit('update:modelValue', handleInputChange($event))"
    >
    <div class="value">
      {{ modelValue }}
    </div>
  </label>
</template>

<style scoped lang="scss">
.input-range {
  display: inline-block;
  max-width: 200px;
  .title {
    font-size: 16px;
    margin-bottom: 10px;
    letter-spacing: 1px;
  }
  .value {
    text-align: center;
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


$track-color: #666 !default;
$thumb-color: #aaa !default;

$thumb-radius: 12px !default;
$thumb-height: 24px !default;
$thumb-width: 24px !default;

$track-width: 100% !default;
$track-height: 6px !default;

$track-radius: 5px !default;
$contrast: 5% !default;

@mixin track {
  cursor: default;
  height: $track-height;
  transition: all .2s ease;
  width: $track-width;
  cursor: pointer;
}

@mixin thumb {
  background: $thumb-color;
  box-sizing: border-box;
  cursor: default;
  height: $thumb-height;
  width: $thumb-width;
  cursor: pointer;
}

[type='range'] {
  -webkit-appearance: none;
  background: transparent;
  margin: $thumb-height / 2 0;
  width: $track-width;

  &::-moz-focus-outer {
    border: 0;
  }

  &:focus {
    outline: 0;

    &::-webkit-slider-runnable-track {
      background: lighten($track-color, $contrast);
    }

    &::-ms-fill-lower {
      background: $track-color;
    }

    &::-ms-fill-upper {
      background: lighten($track-color, $contrast);
    }
  }

  &::-webkit-slider-runnable-track {
    @include track;
    background: $track-color;
  }

  &::-webkit-slider-thumb {
    @include thumb;
    -webkit-appearance: none;
    margin-top: (($track-height) / 2 - $thumb-height / 2);
  }

  &::-moz-range-track {
    @include track;
    background: $track-color;
    height: $track-height / 2;
  }

  &::-moz-range-thumb {
    @include thumb;
  }

  &:disabled {
    &::-webkit-slider-thumb,
    &::-moz-range-thumb,
    &::-webkit-slider-runnable-track {
      cursor: not-allowed;
    }
  }
}
</style>