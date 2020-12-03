import { ICacheItem } from "../cache-container"

export interface IStorage {
    getItem(key: string): Promise<ICacheItem | undefined>

    setItem(key: string, content: ICacheItem | undefined): Promise<void>

    clear(): Promise<void>
}
