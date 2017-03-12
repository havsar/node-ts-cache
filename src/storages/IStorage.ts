export interface IStorage {
    getItem<T>(key: string): Promise<T>;
    setItem(key: string, content: any): Promise<void>;
    clear(): Promise<void>;
}