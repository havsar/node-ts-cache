import * as Bluebird from "bluebird"
import { ICacheItem, IStorage } from "node-ts-cache"

const Fs = Bluebird.promisifyAll(require("fs"))

export class NodeFsStorage implements IStorage {
    constructor(public jsonFilePath: string) {
        if (!Fs.existsSync(this.jsonFilePath)) {
            this.createEmptyCache()
        }
    }

    public async getItem(key: string): Promise<ICacheItem | undefined> {
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
        Fs.writeFileSync(this.jsonFilePath, JSON.stringify({}))
    }

    private async setCache(newCache: any): Promise<void> {
        await Fs.writeFileAsync(this.jsonFilePath, JSON.stringify(newCache))
    }

    private async getCacheObject(): Promise<any> {
        return JSON.parse(
            (await Fs.readFileAsync(this.jsonFilePath)).toString()
        )
    }
}
