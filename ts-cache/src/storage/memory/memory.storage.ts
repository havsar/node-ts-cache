import { SynchronousCacheType} from "../../types/cache.types";

export class MemoryStorage implements SynchronousCacheType {
  private memCache: any = {};

  constructor() {}

  public getItem<T>(key: string): T | undefined {
    return this.memCache[key];
  }

  public setItem(key: string, content: any): void {
    this.memCache[key] = content;
  }

  public clear(): void {
    this.memCache = {};
  }
}
