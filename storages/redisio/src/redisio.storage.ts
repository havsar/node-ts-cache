import { StorageTypes } from "@hokify/node-ts-cache";
import * as Redis from "ioredis";

export class RedisIOStorage implements StorageTypes {
  constructor(
    redisOptions: Redis.RedisOptions,
    private client = new Redis(redisOptions)
  ) {}

  public async getItem<T>(key: string): Promise<T | undefined> {
    const entry: any = await this.client.get(key);
    let finalItem = entry;
    try {
      finalItem = JSON.parse(entry);
    } catch (error) {}
    return finalItem || undefined;
  }

  public async setItem(key: string, content: any): Promise<void> {
    if (typeof content === "object") {
      content = JSON.stringify(content);
    } else if (content === undefined) {
      await this.client.del(key);
      return;
    }
    await this.client.set(key, content);
  }

  public async clear(): Promise<void> {
    await this.client.flushdb();
  }
}
