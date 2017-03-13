import { IStorage } from "./IStorage";
import * as Bluebird from "bluebird";
const redis = require("redis");

Bluebird.promisifyAll(redis.RedisClient.prototype);
Bluebird.promisifyAll(redis.Multi.prototype);

export class RedisStorage implements IStorage {

    private client: any;

    constructor(private host: string, private port: number, password: string) {
        this.client = redis.createClient(port, host, { password: password });
    }

    public async getItem<T>(key: string): Promise<T> {
        return this.client.getAsync(key);
    }

    public async setItem(key: string, content: any): Promise<void> {
        return this.client.setAsync(key, content);
    }

    public async clear(): Promise<void> {
        return this.client.flushdbAsync();
    }
}