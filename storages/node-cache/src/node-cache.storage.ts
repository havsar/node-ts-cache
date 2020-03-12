import { SynchronousCacheType } from "@hokify/node-ts-cache";

import * as NodeCache from "node-cache";

export class NodeCacheStorage implements SynchronousCacheType {
  myCache: NodeCache;

  constructor(options: NodeCache.Options) {
    this.myCache = new NodeCache(options);
  }

  public getItem<T>(key: string): T | undefined {
    return this.myCache.get(key) || undefined;
  }

  public setItem(key: string, content: any): void {
    this.myCache.set(key, content);
  }

  public clear(): void {
    this.myCache.flushAll();
  }
}
