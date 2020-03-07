import { StorageTypes } from "../../storage/storage.types";
import { ICacheStrategy } from "./cache.strategy.types";

export abstract class AbstractBaseStrategy implements ICacheStrategy {
  constructor(protected storage: StorageTypes) {}

  public abstract async getItem<T>(key: string): Promise<T | undefined>;

  public abstract async setItem(
    key: string,
    content: any,
    options: any
  ): Promise<void>;

  public abstract async clear(): Promise<void>;
}
