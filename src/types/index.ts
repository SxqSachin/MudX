export type VoidCallback = () => void;
export type ReturnCallback<T> = () => T;
export type DataCallback<T> = (data: T) => void;
export type DataProcessCallback<T> = (data: T) => T | void | null;
export type AsyncDataProcessCallback<T> = (data: T) => Promise<T | void | null>;

export interface KVPair<T = string> {
  key: string;
  value: T;
  label: string;
}