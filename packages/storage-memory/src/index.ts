import { ICacheItem, IStorage } from "node-ts-cache"

export class MemoryStorage implements IStorage {
    private memCache: any = {}

    constructor() {}

    public async getItem(key: string): Promise<ICacheItem | undefined> {
        return this.memCache[key]
    }

    public async setItem(key: string, content: any): Promise<void> {
        this.memCache[key] = content
    }

    public async clear(): Promise<void> {
        this.memCache = {}
    }
}
