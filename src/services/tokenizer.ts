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
}
