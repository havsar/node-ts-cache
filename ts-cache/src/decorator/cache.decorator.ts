import { JSONStringifyKeyStrategy } from '../strategy/key/json.stringify.strategy'
import { AbstractBaseStrategy } from '../strategy/caching/abstract.base.strategy'
import { IKeyStrategy } from '../index'

const defaultKeyStrategy = new JSONStringifyKeyStrategy()

export function Cache(cachingStrategy: AbstractBaseStrategy, options: any, keyStrategy: IKeyStrategy = defaultKeyStrategy): Function {
    return function (target: Object & { __cache_decarator_pending_results: {[key: string]: Promise<any> | undefined }}, methodName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
        const className = target.constructor.name

       descriptor.value = async function (...args: any[]) {
           const cacheKey = await keyStrategy.getKey(className, methodName, args)

           if (!target.__cache_decarator_pending_results) {
               target.__cache_decarator_pending_results = {}
           }

           if (!target.__cache_decarator_pending_results[cacheKey]) {
               target.__cache_decarator_pending_results[cacheKey] = (async () => {
                   try {
                       const entry = await cachingStrategy.getItem(cacheKey)
                       if (entry) {
                           return entry
                       }
                   } catch (err) {
                       console.warn('node-ts-cache: reading cache failed', cacheKey, err)
                   }

                   const methodCall = originalMethod.apply(this, args)

                   let methodResult

                   const isAsync = methodCall?.constructor?.name === "AsyncFunction" || methodCall?.constructor?.name === "Promise";
                   if (isAsync) {
                       methodResult = await methodCall
                   } else {
                       methodResult = methodCall
                   }

                   try {
                       await cachingStrategy.setItem(cacheKey, methodResult, options)
                   } catch (err) {
                       console.warn('node-ts-cache: writing result to cache failed', cacheKey, err)
                   }
                   // reset pending result object
                   target.__cache_decarator_pending_results[cacheKey] = undefined;
                   return methodResult
               })();
           }

           return target.__cache_decarator_pending_results[cacheKey];
       }

        return descriptor
    }
}
