export interface IStorage {
    getItem(key: string): any;
    setItem(key: string, content: any): void;
}