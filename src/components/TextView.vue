<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useMainStore } from '@/stores/main';
  import AppTextarea from '@/components/atoms/AppTextarea.vue';
  let text = ref('');
  const store = useMainStore();

  text.value = store.generatedText;

  watch(() => store.generatedText, (value) => {
    text.value = value;
  });

</script>
<template>
  <div class="text-view">
    <AppTextarea
      title="generated text"
      :rows="20"
      thick
      v-model="text"
    />
  </div>
</template>

<style lang="scss">
.text-view {
  padding: 30px 0;
}
</style>