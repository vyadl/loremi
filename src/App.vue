<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import TextCreation from '@/components/TextCreation.vue';
import TextTransformation from '@/components/TextTransformation.vue';
import TextView from '@/components/TextView.vue';
import WordCreation from '@/components/WordCreation.vue';
import WordTransformation from '@/components/WordTransformation.vue';
import WordView from '@/components/WordView.vue';
</script>

<template>
  <div class="app">
    <AppHeader />
    <TextCreation />
    <TextTransformation />
    <TextView />
    <WordCreation />
    <WordTransformation />
    <WordView />
    <AppFooter />
  </div>
</template>

<style>
@import './assets/base.css';
.app {
  padding: 0 20px;
  width: 800px;
  margin: 0 auto;
  font: 16px/1.2 Roboto, Tahoma, Verdana, Arial, sans-serif;
}
</style>
