export interface ICacheItem {
    content: any
    meta: {
        createdAt: number
        ttl: number
    }
}

export interface ICachingOptions {
    ttl: number
    isLazy: boolean
    isCachedForever: boolean
    calculateKey: (data: {
        className: string
        methodName: string
        args: any[]
    }) => string
}
