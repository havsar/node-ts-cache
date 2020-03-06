import { JSONStringifyKeyStrategy } from '../strategy/key/json.stringify.strategy'
import { AbstractBaseStrategy } from '../strategy/caching/abstract.base.strategy'
import { IKeyStrategy } from '..'

const defaultKeyStrategy = new JSONStringifyKeyStrategy()

export function Cache(cachingStrategy: AbstractBaseStrategy, options: any, keyStrategy: IKeyStrategy = defaultKeyStrategy): Function {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
        const className = target.constructor.name

        descriptor.value = async function (...args: any[]) {
            const cacheKey = await keyStrategy.getKey(className, methodName, args)

            const entry = await cachingStrategy.getItem(cacheKey)
            if (entry) {
                return entry
            }

            const methodCall = originalMethod.apply(this, args)

            let methodResult
            if (methodCall && methodCall.then) {
                methodResult = await methodCall
            } else {
                methodResult = methodCall
            }

            await cachingStrategy.setItem(cacheKey, methodResult, options)

            return methodResult
        }

        return descriptor
    }
}
