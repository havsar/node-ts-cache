import { StorageTypes } from '../storage.types'

import { existsSync, writeFileSync, writeFile, readFile } from "fs";

export class FsJsonStorage implements StorageTypes {

    constructor(public jsonFilePath: string) {
        if (!existsSync(this.jsonFilePath)) {
            this.createEmptyCache()
        }
    }

    public async getItem<T>(key: string): Promise<T | undefined> {
        return (await this.getCacheObject())[key]
    }

    public async setItem(key: string, content: any): Promise<void> {
        const cache = await this.getCacheObject()
        cache[key] = content
        await this.setCache(cache)
    }

    public async clear(): Promise<void> {
        await this.createEmptyCache()
    }

    private createEmptyCache(): void {
        writeFileSync(this.jsonFilePath, JSON.stringify({}))
    }

    private async setCache(newCache: any): Promise<void> {
        await new Promise((resolve, reject) => writeFile(this.jsonFilePath, JSON.stringify(newCache), (err) => {
            if(err) {
                reject(err);
                return;
            }
            resolve();
        }))
    }

    private async getCacheObject(): Promise<any> {
        const fileContent: Buffer = await new Promise((resolve, reject) => readFile(this.jsonFilePath, (err, result)=> {
            if (err) {
                reject(err);
                return;
            }
            resolve(result)
        }));

        return JSON.parse(fileContent.toString());
    }

}
