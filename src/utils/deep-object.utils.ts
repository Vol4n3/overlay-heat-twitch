export const UpdateItemInObject = <T, U extends keyof T>(current: T, key: U, value: T[U]): T => {
  return { ...current, [key]: value };
};
export const RemoveItemInObject = <T, U extends keyof T>(current: T, key: U): Omit<T, U> => {
  const { [key]: omit, ...extract } = current;
  return extract as T;
};
export const FindAndDeleteItemInArray = <T, U extends keyof T>(current: T[], key: U, value: T): T[] => {
  const index = current.findIndex((c) => c[key] === value[key]);
  if (index < 0) {
    return current;
  }
  return RemoveItemInArray(current, index);
};
export const FindAndUpdateItemInArray = <T, U extends keyof T>(current: T[], key: U, value: T): T[] => {
  const index = current.findIndex((c) => c[key] === value[key]);
  if (index < 0) {
    return current;
  }
  return UpdateItemInArray(current, index, value);
};
export const UpdateItemInArray = <T>(current: T[], index: number, value: T): T[] => {
  return current.map((item, i) => i === index ? value : item);
};
export const RemoveItemInArray = <T>(current: T[], index: number): T[] => {
  return current.filter((_, i) => i !== index);
};
export const TranslateItemInArray = <T>(arr: T[], from: number, to: number): T[] => {
  if (to < 0) {
    return arr;
  }
  const copy = arr.slice();
  copy.splice(to, 0, copy.splice(from, 1)[0]);
  return copy;
};
