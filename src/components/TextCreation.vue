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