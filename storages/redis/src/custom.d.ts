import * as Redis from "redis";

interface RedisClient extends Redis.RedisClient {
  getAsync(arg: string): Promise<string>;

  delAsync(arg: string): Promise<void>;

  setAsync<T>(arg: string, arg2: string): Promise<void>;

  flushdbAsync(): Promise<void>;
}
