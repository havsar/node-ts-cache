import * as IORedis from 'ioredis'
import { ICacheEntry, StorageTypes } from 'node-ts-cache'

export default class IoRedisStorage implements StorageTypes {

    constructor(private ioRedisInstance: IORedis.Redis) {

    }

    async clear(): Promise<void> {
        await this.ioRedisInstance.flushdb()
    }

    async getItem<T>(key: string): Promise<T | undefined> {
        const response = await this.ioRedisInstance.get(key)

        if (response === undefined || response === null || response === '') {
            return undefined
        }

        return JSON.parse(response)
    }

    async setItem(key: string, content: ICacheEntry | undefined): Promise<void> {
        if (content === undefined) {
            await this.ioRedisInstance.del(key)

            return
        }

        await this.ioRedisInstance.set(key, JSON.stringify(content))
    }

}
