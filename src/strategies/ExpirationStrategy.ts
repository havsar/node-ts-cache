import { IStorage } from '../storages/IStorage'
import { AbstractBaseStrategy } from './AbstractBaseStrategy'

interface IExpiringCacheItem {
    content: any;
    meta: {
        createdAt: number;
        ttl: number;
    }
}

interface IOptions {
    ttl?: number;
    isLazy?: boolean;
    isCachedForever?: boolean;
}

export class ExpirationStrategy extends AbstractBaseStrategy {

    constructor(storage: IStorage) {
        super(storage)
    }

    public async getItem<T>(key: string): Promise<T> {
        const item = await this.storage.getItem<IExpiringCacheItem>(key)
        if (item && item.meta && item.meta.ttl && this.isItemExpired(item)) {
            await this.storage.setItem(key, undefined)
            return undefined
        }
        return item ? item.content : undefined
    }

    public async setItem(key: string, content: any, options: IOptions): Promise<void> {
        options = {ttl: 60, isLazy: true, isCachedForever: false, ...options}

        let meta = {}

        if (!options.isCachedForever) {
            meta = {
                ttl: options.ttl * 1000,
                createdAt: Date.now()
            }

            if (!options.isLazy) {
                setTimeout(() => {
                    this.unsetKey(key)
                }, options.ttl)
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
