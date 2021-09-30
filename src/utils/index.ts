import clone from 'just-clone';
import { VoidCallback } from '../types';

export function isString(obj: any) {
  return typeof obj === 'string';
}

export function isEmpty(obj: any) {
  if (!obj) { // boolean number
    return true;
  }

  if (typeof obj === 'string' && (!obj.length || obj === '')) { // string
    return true;
  }

  if (Array.isArray(obj) && !obj.length) {
    return true;
  }

  if (!Object.keys(obj)) { // obj
    return true;
  }

  return false;
}

export function deepClone<T>(obj: T): T {
  return clone(obj as unknown as object) as unknown as T;
  // return JSON.parse(JSON.stringify(obj));
}

export function toArray<T>(obj: T | T[]): T[] {
  if (Array.isArray(obj)) {
    return obj;
  }

  if (!obj) {
    return []
  }

  return [obj];
}

// ====================

export const noop: VoidCallback = () => void(0);