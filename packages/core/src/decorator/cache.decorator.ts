import { JSONStringifyKeyStrategy } from "../strategy/key/json.stringify.strategy"
import { AbstractBaseStrategy } from "../strategy/caching/abstract.base.strategy"
import { IKeyStrategy } from "../strategy/key/key.strategy.types"
import Debug from "debug"

const debug = Debug("node-ts-cache")

const defaultKeyStrategy = new JSONStringifyKeyStrategy()

export function Cache(
    cachingStrategy: AbstractBaseStrategy,
    options: unknown,
    keyStrategy: IKeyStrategy = defaultKeyStrategy
): MethodDecorator {
    return function (
        target: Object,
        methodName: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        const originalMethod = descriptor.value
        const className = target.constructor.name

        descriptor.value = async function (...args: unknown[]) {
            const cacheKey = await keyStrategy.getKey(
                className,
                <string>methodName,
                args
            )

            const entry = await cachingStrategy.getItem(cacheKey)
            if (entry) {
                debug(`Cache HIT ${cacheKey}`)

                return entry
            }

            debug(`Cache MISS ${cacheKey}`)

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

        debug(
            `Added caching support for method ${className}:${methodName.toString()}`
        )

        return descriptor
    }
}
