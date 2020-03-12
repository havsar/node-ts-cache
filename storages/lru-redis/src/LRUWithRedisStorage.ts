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
        try {
          localCache = JSON.parse(localCache);
        } catch (err) {
          console.error('lru redis cache failed parsing data', err);
          localCache = undefined;
        }
        // if found on central cache, copy it to a local cache
        this.myCache.set(key, localCache);
      }
    }

    return localCache || undefined;
  }

  public async setItem(key: string, content: any): Promise<void> {
    this.myCache.set(key, content);
    if (this.options?.maxAge) {
      await this.redis().setex(key, this.options.maxAge, JSON.stringify(content));
    } else {
      await this.redis().set(key, JSON.stringify(content));
    }
  }

  public async clear(): Promise<void> {
    // flush not supported, recreate local lru cache instance
    this.myCache = new LRU(this.options);
  }
}
