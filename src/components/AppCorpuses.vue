<script setup lang="ts">
import { ref, reactive} from 'vue';
import { useMainStore } from '@/stores/main';
import AppButton from './atoms/AppButton.vue';
import InputText from './atoms/InputText.vue';
import AppTextarea from './atoms/AppTextarea.vue';
import SettingBlock from './decorative/SettingBlock.vue';
import { getRandomItemInObject, getRandomItemInArray } from '@/utils/utils';

const emit = defineEmits({
  'change-dict': null,
});

const store = useMainStore();
let isCorpusEditing = ref(false);
let showCustomCorpus = ref(false);
let errorMessage = ref('');
const customCorpusExample = {
  id: '',
  title: '',
  body: '',
  isCustom: true,
};
const customCorpus = reactive({
  ...customCorpusExample,
});

store.fetchCorpuses();

function setCorpus(id: string): void {
  if (store.currentCorpusId !== id ) {
    closeCustomCorpus();
    store.currentCorpusId = id;
    emit('change-dict');
  }
}

function openCreatingCorpus() {
  resetCustomCorpus();
  
  showCustomCorpus.value = true;
  isCorpusEditing.value = false;

  store.currentCorpusId = '';
}

function openEditingCorpus() {
  resetCustomCorpus();
  
  isCorpusEditing.value = true;
  showCustomCorpus.value = true;

  customCorpus.id = store.currentCorpus.id;
  customCorpus.title = store.currentCorpus.title;
  customCorpus.body = store.currentCorpus.body;
}

function saveCustomCorpus(): void {
  if (validateCorpus()) {
    store.saveCorpus(customCorpus);

    closeCustomCorpus();
  }
}

function editCorpus(): void {
  if (validateCorpus(true)) {
    store.editCorpus(customCorpus);
    closeCustomCorpus();
    emit('change-dict');
  }
}

function deleteCorpus(): void {
  store.deleteCorpus(customCorpus.id);
  closeCustomCorpus();
}

function closeCustomCorpus(): void {
  resetCustomCorpus();

  showCustomCorpus.value = false;
  isCorpusEditing.value = false;
}

function resetCustomCorpus() {
  customCorpus.id = '';
  customCorpus.title = '';
  customCorpus.body = '';

  resetErrorMessage();
}

function validateCorpus(isEditing: boolean = false) {
  resetErrorMessage();

  const validationResult = store.checkCorpusValidity(customCorpus, isEditing);
  
  if (validationResult.isValid) {
    return true;
  } else {
    errorMessage.value = validationResult.message;

    return false;
  }
}

function resetErrorMessage() {
  errorMessage.value = '';
}
</script>

<template>
  <SettingBlock
    class="app-corpuses"
    title="corpuses"
  >
    <div class="corpus-list">
      <AppButton
        v-for="corpus in store.corpuses"
        :key="corpus.id"
        :title="corpus.title"
        :active="corpus.id === store.currentCorpusId"
        tag
        @click="setCorpus(corpus.id)"
      />
    </div>
    <form
      v-if="showCustomCorpus"
      class="corpus-form"
      @submit.prevent="isCorpusEditing ? editCorpus() : saveCustomCorpus()"
    >
      <div class="corpus-data">
        <InputText
          class="corpus-title"
          required
          center
          type="text"
          title="title for corpus"
          v-model="customCorpus.title"
          @change="resetErrorMessage"
        />
        <AppTextarea
          class="corpus-text"
          required
          title="corpus"
          v-model="customCorpus.body"
          @change="resetErrorMessage"
        />
      </div>
      <div class="corpus-actions">
        <AppButton
          type="submit"
          :title="isCorpusEditing ? 'save changes' : 'save corpus'"
        />
        <AppButton
          v-if="isCorpusEditing"
          type="button"
          title="delete corpus"
          @click="deleteCorpus"
        />
        <AppButton
          type="button"
          title="cancel"
          @click="closeCustomCorpus"
        />
      </div>
      <div
        v-if="errorMessage"
      >
        {{ errorMessage }}
      </div>
    </form>
    <div class="add-corpus-button-wrapper">
      <AppButton
        title="edit corpus"
        :disabled="!store.currentCorpus?.isCustom"
        @click="openEditingCorpus"
        unbordered
      />
      <AppButton
        title="add corpus"
        @click="openCreatingCorpus"
        unbordered
      />
    </div>
  </SettingBlock>
</template>

<style lang="scss" scoped>
.app-corpuses {
  .corpus-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }
  .corpus-form {
    margin-bottom: 15px;
  }
  .corpus-data {
    margin-bottom: 15px; 
    text-align: center;
  }
  .corpus-text {
    display: block;
    width: 100%;
    resize: none;
    margin-bottom: 15px;
  }
  .corpus-title {
    margin-bottom: 15px;
  }
  .corpus-actions {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
  .add-corpus-button-wrapper {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
    padding-top: 35px;
  }
}
</style>
