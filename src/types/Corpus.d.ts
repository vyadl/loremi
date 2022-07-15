export interface Corpus {
  id: string;
  title: string;
  body: string;
  isCustom?: boolean,
};

export interface Corpuses {
  [key: string]: Corpus;
};
