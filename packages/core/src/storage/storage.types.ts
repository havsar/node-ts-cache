interface ICacheEntry {
    content: any;
    meta: any;
}

export interface StorageTypes {
    getItem<T>(key: string): Promise<T>;

    setItem(key: string, content: ICacheEntry | undefined): Promise<void>;

    clear(): Promise<void>;
}
