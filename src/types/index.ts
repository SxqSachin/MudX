export type VoidCallback = () => void;
export type DataCallback<T> = (data: T) => void;
export type DataProcessCallback<T> = (data: T) => T | void | null;