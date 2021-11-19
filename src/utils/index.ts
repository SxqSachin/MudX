import { ACTION_MSG_DELAY, BATTLE_PARSE_DELAY } from '@/option';
import clone from 'just-clone';
import { VAG, VoidCallback } from '../types';

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

  if (!Object.keys(obj).length) { // obj
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
export const agNoopG: () => VAG = async function* () { return void 0 };
export const agNoop: VAG = agNoopG();

export async function runAsyncGenerate<T>(
  generatorFunction: (t: T) => AsyncGenerator<T, T, T>,
  t: T,
  cb: (param: T) => void
) {
  let it = await generatorFunction(t);

  let result = await it.next(t);
  cb(result.value);

  while (!result.done) {
    t = result.value;
    cb(t);
    result = await it.next();
  }
};

export async function iterateVAG<T>(
  generator: AsyncGenerator<T>,
  cb: (param: T) => void
) {
  let result = await generator.next();
  cb(result.value);

  while (!result.done) {
    result = await generator.next();
    cb(result.value);
  }
}

export function calcFunctionalVal<T extends string | number | Object>(
  obj: T | ((...args: any) => T),
  ...args: any
): T {
  if (typeof obj === "function") {
    return obj(...args);
  }

  return obj;
}


export async function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  })
}
export async function waitBattleParseDelay() {
  return await delay(BATTLE_PARSE_DELAY);
}
export async function waitActionMessageDelay() {
  return await delay(ACTION_MSG_DELAY);
}