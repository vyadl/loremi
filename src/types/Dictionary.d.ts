export interface DictionaryItem {
  leftPartTokens: string[]
  rightPartVariants: string[][]
}

export interface Dictionary {
  [key: string]: DictionaryItem
}
