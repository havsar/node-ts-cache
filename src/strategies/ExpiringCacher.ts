import { IStorage } from '../storages/IStorage';
import { AbstractBaseStrategy } from './AbstractBaseStrategy';

export class ExpiringCacher extends AbstractBaseStrategy {

    constructor(storage: IStorage) {
        super(storage);
    }

    public getItem<T>(key: string): T {
        const item = this.storage.getItem(key);
        if (item && Date.now() > item.createdAt + item.ttl) {
            this.storage.setItem(key, undefined);
            return undefined;
        }
        return item ? item.content : undefined;
    }

    public setItem(key: string, content: any, options: object): void {
        this.storage.setItem(key, {
            options: options,
            content: content
        });
    }
}