import { StorageTypes } from "../../storage/storage.types"
import { ICacheStrategy } from "./cache.strategy.types"

export abstract class AbstractBaseStrategy implements ICacheStrategy {
    constructor(protected storage: StorageTypes) {}

    public abstract getItem<T>(key: string): Promise<T | undefined>

    public abstract setItem(
        key: string,
        content: any,
        options: any
    ): Promise<void>

    public abstract clear(): Promise<void>
}
