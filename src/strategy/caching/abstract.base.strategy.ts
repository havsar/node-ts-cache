import { StorageTypes } from '../../storage/storage.types'
import { ICacheStrategy } from './cache.strategy.types'

export abstract class AbstractBaseStrategy implements ICacheStrategy {

    constructor(protected storage: StorageTypes) {
    }

    public async abstract getItem<T>(key: string): Promise<T>;

    public async abstract setItem(key: string, content: any, options: any): Promise<void>;

    public async abstract clear(): Promise<void>;
}
