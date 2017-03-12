import { IStorage } from '../storages/IStorage';
import { AbstractBaseStrategy } from './AbstractBaseStrategy';

interface IExpiringCacheItem {
    content: any;
    options: {
        createdAt: number;
        ttl: number;
    }
}

export class ExpirationStrategy extends AbstractBaseStrategy {

    constructor(storage: IStorage) {
        super(storage);
    }

    public async getItem<T>(key: string): Promise<T> {
        const item = await this.storage.getItem<IExpiringCacheItem>(key);
        if (item && Date.now() > item.options.createdAt + item.options.ttl) {
            await this.storage.setItem(key, undefined);
            return undefined;
        }
        return item ? item.content : undefined;
    }

    public async setItem(key: string, content: any, options: any): Promise<void> {
        await this.storage.setItem(key, {
            options: {
                ttl: options.ttl,
                createdAt: Date.now()
            },
            content: content
        });
    }

    public async clear(): Promise<void> {
        this.storage.clear();
    }
}