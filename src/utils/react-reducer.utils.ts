import {Reducer} from 'react';
import {RemoveItemInArray, UpdateItemInArray} from './deep-object.utils';

export interface ActionArray<T> {
  clean?: boolean;
  mergeAfter?: T[];
  mergeBefore?: T[];
  push?: T;
  removeOne?: number;
  replace?: T[];
  unshift?: T;
  update?: { index: number, item: T };
}

export type ReducerArrayType<T> = Reducer<T[], ActionArray<T>>;
export const ReducerArray = <T>(current: T[], action: ActionArray<T>): T[] => {
  if (action.clean === true) {
    return [];
  }
  if (typeof action.removeOne === 'number') {
    return RemoveItemInArray(current, action.removeOne);
  }
  if (typeof action.mergeAfter !== 'undefined') {
    return [...current, ...action.mergeAfter];
  }
  if (typeof action.mergeBefore !== 'undefined') {
    return [...action.mergeBefore, ...current];
  }
  if (typeof action.push !== 'undefined') {
    return [...current, action.push];
  }
  if (typeof action.unshift !== 'undefined') {
    return [action.unshift, ...current];
  }
  if (typeof action.replace !== 'undefined') {
    return action.replace;
  }
  if (typeof action.update !== 'undefined') {
    return UpdateItemInArray(current, action.update.index, action.update.item);
  }
  return current;
};

export interface ActionObject<T> {
  merge?: Partial<T>;
  replace?: T;
  incrementNumber?: { key: keyof T, n: number, init?: number };
}
export type ReducerObjectType<T> = Reducer<T, ActionObject<T>>;
export const ReducerObject = <T>(current: T, action: ActionObject<T>): T  => {
  const { replace, merge,incrementNumber} = action;
  if (typeof replace !== 'undefined') {
    return replace;
  }
  if (typeof merge !== 'undefined') {
    return {...current, ...merge};
  }
  if (typeof incrementNumber !== 'undefined') {
    // @ts-ignore
    const prevValue: number = typeof current[incrementNumber.key] === 'number' ?
     current[incrementNumber.key] :
      0;
    return {...current, [incrementNumber.key] : prevValue + incrementNumber.n };
  }
  return current;
};