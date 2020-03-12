import { SynchronousCacheType } from "@hokify/node-ts-cache";

import * as LRU from "lru-cache";

export class LRUStorage implements SynchronousCacheType {
  myCache: LRU<string, any>;

  constructor(private options: LRU.Options<string, any>) {
    this.myCache = new LRU(options);
  }

  public getItem<T>(key: string): T | undefined {
    return this.myCache.get(key) || undefined;
  }

  public setItem(key: string, content: any): void {
    this.myCache.set(key, content);
  }

  public clear(): void {
    // flush not supported, recreate lru cache instance
    this.myCache = new LRU(this.options);
  }
}
