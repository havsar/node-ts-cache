import * as IORedis from "ioredis"
import { ICacheItem, IStorage } from "node-ts-cache"

export class IoRedisStorage implements IStorage {
    constructor(private ioRedisInstance: IORedis.Redis) {}

    async clear(): Promise<void> {
        await this.ioRedisInstance.flushdb()
    }

    async getItem(key: string): Promise<ICacheItem | undefined> {
        const response = await this.ioRedisInstance.get(key)

        if (response === undefined || response === null || response === "") {
            return undefined
        }

        return JSON.parse(response)
    }

    async setItem(key: string, content: ICacheItem | undefined): Promise<void> {
        if (content === undefined) {
            await this.ioRedisInstance.del(key)

            return
        }

        await this.ioRedisInstance.set(key, JSON.stringify(content))
    }
}
