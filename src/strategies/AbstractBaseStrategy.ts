import { IStorage } from '../storages/IStorage';

export abstract class AbstractBaseStrategy {

    constructor(protected storage: IStorage) { }

    public abstract getItem<T>(key: string): T;
    public abstract setItem(key: string, content: any, options: object): void;
}