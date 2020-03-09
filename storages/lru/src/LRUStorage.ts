import { StorageTypes } from "@hokify/node-ts-cache";

import * as LRU from "lru-cache";

export class LRUStorage implements StorageTypes {
  myCache: LRU<string, any>;

  constructor(private options: LRU.Options<string, any>) {
    this.myCache = new LRU(options);
  }

  public async getItem<T>(key: string): Promise<T | undefined> {
    return this.myCache.get(key) || undefined;
  }

  public async setItem(key: string, content: any): Promise<void> {
    this.myCache.set(key, content);
  }

  public async clear(): Promise<void> {
    // flush not supported, recreate lru cache instance
    this.myCache = new LRU(this.options);
  }
}
