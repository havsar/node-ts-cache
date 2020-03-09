import { StorageTypes } from "@hokify/node-ts-cache";

import * as NodeCache from "node-cache";

export class NodeCacheStorage implements StorageTypes {
  myCache: NodeCache;

  constructor(options: NodeCache.Options) {
    this.myCache = new NodeCache(options);
  }

  public async getItem<T>(key: string): Promise<T | undefined> {
    return this.myCache.get(key) || undefined;
  }

  public async setItem(key: string, content: any): Promise<void> {
    this.myCache.set(key, content);
  }

  public async clear(): Promise<void> {
    this.myCache.flushAll();
  }
}
