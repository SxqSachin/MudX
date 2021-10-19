const storage = window.localStorage;

class _XStorage implements Storage {
  [name: string]: any;

  get length() {
    return storage.length;
  }

  clear(): void {
    return storage.clear();
  }
  getItem(key: string): string | null {
    return storage.getItem(key);
  }
  key(index: number): string | null {
    return storage.key(index);
  }
  removeItem(key: string): void {
    return storage.removeItem(key);
  }
  setItem(key: string, value: string): void {
    return storage.setItem(key, value);
  }
}

const XStorage = new _XStorage();

export {
  XStorage
}