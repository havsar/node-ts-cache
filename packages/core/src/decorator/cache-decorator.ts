import Debug from "debug"
import { CacheContainer, ICachingOptions } from "../cache-container"

const debug = Debug("node-ts-cache")

const jsonCalculateKey = (data: {
    className: string
    methodName: string
    args: any[]
}) => {
    return `${data.className}--${<string>data.methodName}--${JSON.stringify(
        data.args
    )}`
}

export function Cache(
    container: CacheContainer,
    options?: Partial<ICachingOptions>
): MethodDecorator {
    return function (
        target: Object,
        methodName: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        const originalMethod = descriptor.value
        const className = target.constructor.name

        descriptor.value = async function (...args: unknown[]) {
            options ??= {}

            const keyOptions = {
                args,
                methodName: <string>methodName,
                className
            }
            const cacheKey = options.calculateKey
                ? options.calculateKey(keyOptions)
                : jsonCalculateKey(keyOptions)

            const entry = await container.getItem(cacheKey)

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

            await container.setItem(cacheKey, methodResult, options)

            return methodResult
        }

        debug(
            `Added caching support for method ${className}:${methodName.toString()}`
        )

        return descriptor
    }
}
