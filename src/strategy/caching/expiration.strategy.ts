import { StorageTypes } from '../../storage/storage.types'
import { AbstractBaseStrategy } from './abstract.base.strategy'

interface IExpiringCacheItem {
    content: any;
    meta: {
        createdAt: number;
        ttl: number;
    }
}

interface IOptions {
    ttl: number;
    isLazy: boolean;
    isCachedForever: boolean;
}

const DEFAULT_TTL_SECONDS = 60

export class ExpirationStrategy extends AbstractBaseStrategy {

    constructor(storage: StorageTypes) {
        super(storage)
    }

    public async getItem<T>(key: string): Promise<T | undefined> {
        const item = await this.storage.getItem<IExpiringCacheItem>(key)
        if (item && item.meta && item.meta.ttl && this.isItemExpired(item)) {
            await this.storage.setItem(key, undefined)

            return undefined
        }
        return item ? item.content : undefined
    }

    public async setItem(key: string, content: any, options: Partial<IOptions>): Promise<void> {
        const finalOptions = {ttl: DEFAULT_TTL_SECONDS, isLazy: true, isCachedForever: false, ...options}

        let meta = {}

        if (!options.isCachedForever) {
            meta = {
                ttl: finalOptions.ttl * 1000,
                createdAt: Date.now()
            }

            if (!options.isLazy) {
                setTimeout(() => {
                    this.unsetKey(key)
                }, finalOptions.ttl)
            }
        }
        await this.storage.setItem(key, {meta, content})
    }

    public async clear(): Promise<void> {
        await this.storage.clear()
    }

    private isItemExpired(item: IExpiringCacheItem): boolean {
        return Date.now() > item.meta.createdAt + item.meta.ttl
    }

    private async unsetKey(key: string): Promise<void> {
        await this.storage.setItem(key, undefined)
    }
}
