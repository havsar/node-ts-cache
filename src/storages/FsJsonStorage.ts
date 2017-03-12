import { IStorage } from './IStorage';
import * as Fs from 'fs';

export class FsJsonStorage implements IStorage {
 
    constructor(public jsonFilePath: string) {
        if (!Fs.existsSync(this.jsonFilePath)) {
            Fs.writeFileSync(this.jsonFilePath, JSON.stringify({}));
        }
    }

    public getItem(key: string): any {
        return this.getCache()[key];
    }

    public setItem(key: string, content: any): void {
        const cache = this.getCache();
        cache[key] = content;
        this.setCache(cache);
    }

    private setCache(newCache: any): void {
        Fs.writeFileSync(this.jsonFilePath, JSON.stringify(newCache));
    }

    private getCache(): any {
        return JSON.parse(Fs.readFileSync(this.jsonFilePath).toString());
    }

}