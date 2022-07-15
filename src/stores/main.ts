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
