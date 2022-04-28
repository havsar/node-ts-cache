import { ICacheItem } from "../cache-container"

export interface IStorage {
    getItem(key: string): Promise<ICacheItem | undefined>

    setItem(key: string, content: ICacheItem | undefined): Promise<void>

    removeItem(key: string): Promise<ICacheItem | undefined>

    getAll(): Promise<any>    

    clear(): Promise<void>
}
