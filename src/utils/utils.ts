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
