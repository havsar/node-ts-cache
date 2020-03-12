import { JSONStringifyKeyStrategy } from "../strategy/key/json.stringify.strategy";
import { ISyncKeyStrategy } from "../index";
import { SynchronousCacheType } from "../types/cache.types";

const defaultKeyStrategy = new JSONStringifyKeyStrategy();

export function SyncCache(
  cachingStrategy: SynchronousCacheType,
  options?: any,
  keyStrategy: ISyncKeyStrategy = defaultKeyStrategy
): Function {
  return function(
    target: Object,
    methodName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    descriptor.value = async function(...args: any[]) {
      const cacheKey = keyStrategy.getKey(className, methodName, args);

      try {
        const entry = cachingStrategy.getItem(cacheKey);
        if (entry) {
          return entry;
        }
      } catch (err) {
        console.warn(
          "@hokify/node-ts-cache: reading cache failed",
          cacheKey,
          err
        );
      }

      const methodResult = originalMethod.apply(this, args);

      const isAsync =
        methodResult?.constructor?.name === "AsyncFunction" ||
        methodResult?.constructor?.name === "Promise";

      if (isAsync) {
        throw new Error("async function detected, use @Cache instead");
      }

      try {
        cachingStrategy.setItem(cacheKey, methodResult, options);
      } catch (err) {
        console.warn(
          "@hokify/node-ts-cache: writing result to cache failed",
          cacheKey,
          err
        );
      }
      return methodResult;
    };

    return descriptor;
  };
}
