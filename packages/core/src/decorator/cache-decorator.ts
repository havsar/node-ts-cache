import Debug from "debug"
import { CacheContainer, ICachingOptions } from "../cache-container"

const debug = Debug("node-ts-cache")

const jsonCalculateKey = (data: {
    className: string
    methodName: string
    args: any[]
}) => {
    return `${data.className}:${<string>data.methodName}:${JSON.stringify(
        data.args
    )}`
}

export function Cache(
    container: CacheContainer,
    options?: Partial<ICachingOptions>
): MethodDecorator {
    return function (
        target: Object & {
            __node_ts_cache_method_run_queue?: {
                [key: string]: Promise<any> | undefined
            }
        },
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

            const runOriginalMethod = async () => {
                const methodCall = originalMethod.apply(this, args)

                const isAsync =
                    methodCall?.constructor?.name === "AsyncFunction" ||
                    methodCall?.constructor?.name === "Promise"

                if (isAsync) {
                    return await methodCall
                } else {
                    return methodCall
                }
            }

            if (!target.__node_ts_cache_method_run_queue) {
                target.__node_ts_cache_method_run_queue = {}
            }

            if (target.__node_ts_cache_method_run_queue[cacheKey]) {
                debug(`Method is already enqueued ${cacheKey}`)

                return target.__node_ts_cache_method_run_queue[cacheKey]
            }

            target.__node_ts_cache_method_run_queue[cacheKey] = (async () => {
                try {
                    const entry = await container.getItem(cacheKey)

                    if (entry) {
                        debug(`Cache HIT ${cacheKey}`)

                        return entry
                    }

                    debug(`Cache MISS ${cacheKey}`)

                    const methodResult = await runOriginalMethod()

                    await container.setItem(cacheKey, methodResult, options)

                    return methodResult
                } finally {
                    target.__node_ts_cache_method_run_queue![cacheKey] =
                        undefined
                }
            })()

            return target.__node_ts_cache_method_run_queue[cacheKey]
        }

        debug(`Added caching for method ${className}:${methodName.toString()}`)

        return descriptor
    }
}
