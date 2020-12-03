import Debug from "debug"
import { IStorage } from "../storage"
import { ICacheItem, ICachingOptions } from "./cache-container-types"

const debug = Debug("node-ts-cache")

const DEFAULT_TTL_SECONDS = 60

export class CacheContainer {
    constructor(private storage: IStorage) {}

    public async getItem<T>(key: string): Promise<T | undefined> {
        const item = await this.storage.getItem(key)

        if (item?.meta?.ttl && this.isItemExpired(item)) {
            await this.unsetKey(key)

            return undefined
        }

        return item ? item.content : undefined
    }

    public async setItem(
        key: string,
        content: any,
        options: Partial<ICachingOptions>
    ): Promise<void> {
        const finalOptions = {
            ttl: DEFAULT_TTL_SECONDS,
            isLazy: true,
            isCachedForever: false,
            ...options
        }

        let meta: any = {}

        if (!finalOptions.isCachedForever) {
            meta = {
                ttl: finalOptions.ttl * 1000,
                createdAt: Date.now()
            }

            if (!finalOptions.isLazy) {
                setTimeout(() => {
                    this.unsetKey(key)

                    debug(`Expired key ${key} removed from cache`)
                }, finalOptions.ttl)
            }
        }

        await this.storage.setItem(key, { meta, content })
    }

    public async clear(): Promise<void> {
        await this.storage.clear()

        debug("Cleared cache")
    }

    private isItemExpired(item: ICacheItem): boolean {
        return Date.now() > item.meta.createdAt + item.meta.ttl
    }

    private async unsetKey(key: string): Promise<void> {
        await this.storage.setItem(key, undefined)
    }
}
