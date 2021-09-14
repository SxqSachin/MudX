export function isStrint(obj: any) {
  return typeof obj === 'string';
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}