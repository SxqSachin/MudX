export type VoidCallback = () => void;
export type ReturnCallback<T> = () => T;
export type DataCallback<T> = (data: T) => void;
export type DataProcessCallback<T> = (data: T) => T | void | null;