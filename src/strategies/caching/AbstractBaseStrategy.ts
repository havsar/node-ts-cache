import { IStorage } from '../../storages/IStorage';
import { ICacheStrategy } from './ICacheStrategy';

export abstract class AbstractBaseStrategy implements ICacheStrategy {

    constructor(protected storage: IStorage) { }

    public async abstract getItem<T>(key: string): Promise<T>;
    public async abstract setItem(key: string, content: any, options: any): Promise<void>;
    public async abstract clear(): Promise<void>;
}
