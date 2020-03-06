import { StorageTypes } from 'node-ts-cache'

import * as LRU from 'lru-cache';

export class LruStorage implements StorageTypes {
    myCache: LRU<string, any>;

    constructor(options: LRU.Options<string, any>) {
        this.myCache = new LRU(options);
    }

    public async getItem<T>(key: string): Promise<T | undefined> {
        return this.myCache.get(key);
    }

    public async setItem(key: string, content: any): Promise<void> {
        this.myCache.set(key, content);
    }

    public async clear(): Promise<void> {
        throw new Error('clear not supported for LRU cache');
    }

}
