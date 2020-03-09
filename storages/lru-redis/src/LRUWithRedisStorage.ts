import { StorageTypes } from "@hokify/node-ts-cache";

import * as LRU from "lru-cache";
import * as Redis from "ioredis";

export class LRUWithRedisStorage implements StorageTypes {
  myCache: LRU<string, any>;

  constructor(
    private options: LRU.Options<string, any>,
    private redis: () => Redis.Redis
  ) {
    this.myCache = new LRU(options);
  }

  public async getItem<T>(key: string): Promise<T | undefined> {
    // check local cache
    let localCache = this.myCache.get(key);

    if (!localCache) {
      // check central cache
      localCache = await this.redis().get(key);

      if (localCache) {
        // if found on central cache, copy it to a local cache
        this.myCache.set(key, localCache);
      }
    }

    return localCache;
  }

  public async setItem(key: string, content: any): Promise<void> {
    this.myCache.set(key, content);
    await this.redis().set(key, content);
  }

  public async clear(): Promise<void> {
    // flush not supported, recreate local lru cache instance
    this.myCache = new LRU(this.options);
  }
}
