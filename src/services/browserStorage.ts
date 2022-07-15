import type { Corpus, Corpuses } from '@/types/Corpus';

const LOCAL_STORAGE_CUSTOM_CORPUSES_KEY = 'customCorpuses';

export const browserStorage = {
  saveCustomCorpuses(corpuses: Corpuses): void {
    const customCorpuses = Object.keys(corpuses).reduce((result: Corpuses, key) => {
      if (corpuses[key].isCustom) {
        result[key] = corpuses[key];
      }

      return result;
    }, {});

    localStorage.setItem(LOCAL_STORAGE_CUSTOM_CORPUSES_KEY, JSON.stringify(customCorpuses));
  },
  getCustomCorpuses(): Corpuses | null {
    const corpuses: string | null = localStorage.getItem(LOCAL_STORAGE_CUSTOM_CORPUSES_KEY);

    if (corpuses) {
      return JSON.parse(corpuses);
    } else {
      return {};
    }
  },
};
