import {AsynchronousCacheType, SynchronousCacheType} from "../../types/cache.types";

export abstract class AbstractBaseStrategy implements AsynchronousCacheType {
  constructor(protected storage: AsynchronousCacheType | SynchronousCacheType) {}

  public abstract async getItem<T>(key: string): Promise<T | undefined>;

  public abstract async setItem(
    key: string,
    content: any,
    options: any
  ): Promise<void>;

  public abstract async clear(): Promise<void>;
}
