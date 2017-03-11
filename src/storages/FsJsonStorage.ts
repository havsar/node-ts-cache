import { IStorage } from './IStorage';
import * as Fs from 'fs';

export class FsJsonStorage implements IStorage {

    private fileName: string = "cache.json";
 
    constructor() {
        if (!Fs.existsSync(this.fileName)) {
            Fs.writeFileSync(this.fileName, JSON.stringify({}));
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
        Fs.writeFileSync(this.fileName, JSON.stringify(newCache));
    }

    private getCache(): any {
        return JSON.parse(Fs.readFileSync(this.fileName).toString());
    }

}