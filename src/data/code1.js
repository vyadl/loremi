export const code1 = {
  id: '___code1',
  title: 'code of this site',
  body: `<script setup lang="ts">
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
  <script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { getDictionary, getText } from '@/services/tokenizer';

import AppButton from './atoms/AppButton.vue';
import InputRange from './atoms/InputRange.vue';
import InputText from './atoms/InputText.vue';
import SettingBlock from './decorative/SettingBlock.vue';
import AppCorpuses from './AppCorpuses.vue';
import { getRandomItemInObject, getRandomItemInArray } from '@/utils/utils';

const store = useMainStore();
const options = reactive({
  tokenLengths: {
    left: 2,
    right: 1,
  },
  textLength: 20,
});
let exampleTokenTrigger = ref(true);

const exampleTokens = computed((): {
  precondition: string,
  prediction: string,
} => {
  exampleTokenTrigger.value;
  const randomItem = getRandomItemInObject(store.dictionary);
  const randomPrediction = getRandomItemInArray(randomItem.value.rightPartVariants).join('');
  
  return {
    precondition: String(randomItem.key),
    prediction: randomPrediction,
  }
});

function generateText(): void {
  store.generatedText = getText(store.dictionary, options.textLength * 2, options.tokenLengths.left);
}

function changeDict(): void {
  store.dictionary = getDictionary(
    store.currentCorpus.body,
    { tokenLengths: options.tokenLengths },
  );
}

function triggerTokenExamples(): void {
  exampleTokenTrigger.value = !exampleTokenTrigger.value;
}

</script>
<template>
  <div class="text-creation">
    <AppCorpuses @change-dict="changeDict()"/>
    <SettingBlock
      v-if="store.currentCorpusId"
      title="token settings"
    >
      <div class="tokens">
        <div class="token-block">
          <InputRange
            title="precondition length"
            v-model.number="options.tokenLengths.left"
            :min="1"
            :max="20"
            :step="1"
            @input="changeDict"
          />
        </div>
        <div class="arrow">
          <div>→</div>
        </div>
        <div class="token-block">
          <InputRange
            title="prediction length"
            v-model.number="options.tokenLengths.right"
            :min="1"
            :max="20"
            :step="1"
            @input="changeDict"
          />
        </div>
      </div>
      <div class="examples">
        <div class="tokens examples">
          <div class="token-block">
            {{ exampleTokens.precondition }}
          </div>
          <div class="token-block">
            <AppButton
              @click="triggerTokenExamples"
              title="change examples"
            />
          </div>
          <div class="token-block">
            {{ exampleTokens.prediction }}
          </div>
        </div>
      </div>
    </SettingBlock>
    <SettingBlock
      v-if="store.currentCorpusId"
      title="generating settings"
      center
    >
      <InputText
        title="text length in tokens"
        type="number"
        center
        v-model.number="options.textLength"
      />
    </SettingBlock>
    <div
      v-if="store.currentCorpusId"
      class="actions"
    >
      <AppButton
        @click="generateText"
        title="generate text"
        :disabled="!store.currentCorpus"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-creation {
  .tokens {
    display: flex;
    justify-content: space-between;
    &.examples {
      text-align: center;
      align-items: center;
    }
  }
  .token-block {
    width: 200px;
    text-align: center;
  }
  .example-title {
    text-align: center;
    padding-bottom: 10px;
    font-size: 14px;
    border-bottom: 1px solid #333;
    margin-bottom: 20px;
  }
  .arrow {
    font-size: 55px;
    color: #555;
    font-family: Tahoma, monospace;
    padding-top: 20px;
  }
  .actions {
    text-align: center;
  }
}
</style>
import { nanoid } from 'nanoid';
import { defineStore } from 'pinia';
import type { Corpus, Corpuses } from '@/types/Corpus';
import type { Dictionary } from '@/types/Dictionary';
import { corpuses } from '@/data/corpuses.js';
import { browserStorage }  from '@/services/browserStorage';

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    corpuses: {} as Corpuses,
    currentCorpusId: '' as string,
    dictionary: {} as Dictionary,
    generatedText: '',
    generatedWords: [],
    savedSemanticItems: {},
  }),
  getters: {
    currentCorpus: (state): Corpus => state.corpuses?.[state.currentCorpusId],
  },
  actions: {
    fetchCorpuses() {
      const basicCorpuses = corpuses.reduce((result: Corpuses, item: Corpus) => {
        result[item.id] = item;

        return result;
      }, {});

      this.corpuses = {
        ...basicCorpuses,
        ...browserStorage.getCustomCorpuses(),
      };
    },
    checkCorpusValidity(corpus: Corpus, isEditing: boolean = false): {
      isValid: boolean;
      message: string;
    } {
      const result = {
        isValid: true,
        message: '',
      };
      const isDuplicatedTitle =
        Object.entries(this.corpuses).some(([key, value]) => value.title === corpus.title);

      if (!isEditing && isDuplicatedTitle) {
        result.isValid = false;
        result.message = 'This title is already in use';
      }
      
      if (corpus.body.split(' ').length < 3) {
        result.isValid = false;
        result.message = 'The corpus is too short';
      }

      return result;
    },
    saveCorpus(corpus: Corpus) {
      if (this.checkCorpusValidity(corpus).isValid) {
        const id = nanoid();

        this.corpuses[id] = {
          ...corpus,
          id,
          isCustom: true,
        };
        browserStorage.saveCustomCorpuses(this.corpuses);
      }
    },
    editCorpus(corpus: Corpus) {
      this.corpuses[corpus.id] = { ...corpus };
      browserStorage.saveCustomCorpuses(this.corpuses);
    },
    deleteCorpus(id: string) {
      if (this.corpuses[id]) {
        delete this.corpuses[id];
        browserStorage.saveCustomCorpuses(this.corpuses);
      }
    }
  },
});
export interface randomObjectItem<T> {
  key: string | number | symbol;
  value: T;
};
export type ValueOf<T> = T[keyof T];

export const getRandomItemInArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomItemInObject = <T>(obj: T): randomObjectItem<ValueOf<T>> => {
  const keys: Array<keyof T> = Object.keys(obj) as Array<keyof T>;
  const randomKey: keyof T = keys[Math.floor(Math.random() * keys.length)];

  return {
    key: randomKey,
    value: obj[randomKey],
  }
};
import type { Dictionary } from '@/types/Dictionary';

export const getText = (
    dict: Dictionary,
    lengthInTokens: number,
    isZeroVariantsMeansNewRandom: boolean = true,
  ): string => {
  let textArr = [];
  const startString = getRandomDictString(dict);
  const leftTokenLength = dict[Object.keys(dict)[0]].leftPartTokens.length;
  
  textArr.push(...dict[startString].leftPartTokens);
  textArr.push(...getRandomItemInArray(dict[startString].rightPartVariants));

  while (textArr.length < lengthInTokens) {
    let str = textArr.slice(-leftTokenLength).join('');

    if (!dict[str]?.rightPartVariants.length) {
      if (isZeroVariantsMeansNewRandom) {
        textArr.push(' ');
        str = getRandomDictString(dict);
      } else {
        break;
      }
    }

    textArr.push(...getRandomItemInArray(dict[str].rightPartVariants));
  }

  return textArr.join('');

  function getRandomItemInArray(arr: string[][]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export const getDictionary = (
  corpus: string,
  {
    tokenLengths: {
      left: leftTokenLength,
      right: rightTokenLength,
    }
  } = {
    tokenLengths: {
      left: 1,
      right: 1,
    },
  }): Dictionary => {
  const tokenized = getTokenizedCorpus(corpus);
  let dictionary: Dictionary = {};

  tokenized.forEach((_a, i) => {
    const leftEndIndex = i + leftTokenLength;
    const leftPart = tokenized.slice(i, leftEndIndex);
    const rightPart = tokenized.slice(leftEndIndex, leftEndIndex + rightTokenLength);
    const leftPartKey = leftPart.join('');
    const dictEl = dictionary[leftPartKey];

    if (rightPart.length) {
      if (dictEl) {
        dictionary[leftPartKey].rightPartVariants.push(rightPart);
      } else {
        dictionary[leftPartKey] = {
          leftPartTokens: [...leftPart],
          rightPartVariants: rightPart.length ? [rightPart] : [],
        };
      }
    }
  });

  return dictionary;
};

function getTokenizedCorpus(corpus: string): string[] {
  const separators = new Set([' ', ',', '.', '!', '?', ';', ':', '-', '–', '—']);
  const result = [];
  let word = '';

  for (let i = 0; i < corpus.length; i++) {
    const char = corpus[i];

    if (separators.has(char)) {
      if (word.length > 0) {
        result.push(word);
      }

      result.push(char);
      word = '';
    } else {
      word += char;
    }
  }

  return result;
}

function getRandomDictString(dict: Dictionary): string {
  const dictKeys = Object.keys(dict);

  return dictKeys[Math.floor(Math.random() * dictKeys.length)];
}`,
}