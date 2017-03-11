import { IStorage } from './IStorage';

export class MemoryStorage implements IStorage {

    private memCache: any = {};

    constructor() { }

    public getItem(key: string): any {
        return this.memCache[key];
    }

    public setItem(key: string, content: any): void {
        this.memCache[key] = content;
    }

}