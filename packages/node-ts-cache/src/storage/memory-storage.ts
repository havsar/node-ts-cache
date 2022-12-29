import { IStorage } from "./storage-types"
import { ICacheItem } from "../cache-container"

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

    public async unset(key: string): Promise<void> {
        delete this.memCache[key]
    }
}
