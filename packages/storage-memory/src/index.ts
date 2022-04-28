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

    public async removeItem(key: string): Promise<ICacheItem | undefined> {
        const result = this.memCache[key];
        if(result)
            delete this.memCache[key];
        return result;
    }
    
    public async clear(): Promise<void> {
        this.memCache = {}
    }
}
