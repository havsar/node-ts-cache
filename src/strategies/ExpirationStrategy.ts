import { IStorage } from '../storages/IStorage';
import { AbstractBaseStrategy } from './AbstractBaseStrategy';

export class ExpirationStrategy extends AbstractBaseStrategy {

    constructor(storage: IStorage) {
        super(storage);
    }

    public getItem<T>(key: string): T {
        const item = this.storage.getItem(key);
        if (item && Date.now() > item.options.createdAt + item.options.ttl) {
            this.storage.setItem(key, undefined);
            return undefined;
        }
        return item ? item.content : undefined;
    }

    public setItem(key: string, content: any, options: any): void {
        this.storage.setItem(key, {
            options: {
                ttl: options.ttl,
                createdAt: Date.now()
            },
            content: content
        });
    }
}