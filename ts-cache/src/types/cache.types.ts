interface ICacheEntry {
  content: any;
  meta: any;
}

export interface AsynchronousCacheType<C = ICacheEntry> {
  getItem<T>(key: string): Promise<T | undefined>;

  setItem(key: string, content: C | undefined, options?: any): Promise<void>;

  clear(): Promise<void>;
}

export interface SynchronousCacheType<C = ICacheEntry> {
  getItem<T>(key: string): T | undefined;

  setItem(key: string, content: C | undefined, options?: any): void;

  clear(): void;
}
