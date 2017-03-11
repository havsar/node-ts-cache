import { IStorage } from './IStorage';
import * as Fs from 'fs';

export class FsJsonStrategy implements IStorage {

    private memCache: any = {};

    constructor() { }

    public getItem(key: string): any {
        return this.memCache[key];
    }

    public setItem(key: string, content: any): void {
        this.memCache[key] = content;
    }

}