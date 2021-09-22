import clone from 'just-clone';

export function isString(obj: any) {
  return typeof obj === 'string';
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