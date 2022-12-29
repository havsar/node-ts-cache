import { CacheContainer, MemoryStorage } from "node-ts-cache"

interface ITestType {
    user: {
        name: string
    }
}

const data: ITestType = {
    user: { name: "test" }
}

describe("CacheContainer", () => {
    it("Should set cache item with isLazy", async () => {
        const cache = new CacheContainer(new MemoryStorage())

        await cache.setItem("test", data, { ttl: 10 })

        const entry = await cache.getItem<ITestType>("test")

        expect(entry).toStrictEqual(data)
    })

    it("Should return no item if cache expires instantly with isLazy", async () => {
        const cache = new CacheContainer(new MemoryStorage())

        await cache.setItem("test", data, { ttl: -1 })

        const entry = await cache.getItem<ITestType>("test")

        expect(entry).toBeUndefined()
    })

    it("Should not find cache item after ttl with isLazy disabled", async () => {
        const cache = new CacheContainer(new MemoryStorage())

        await cache.setItem("test", data, { ttl: 0.001, isLazy: false })

        await wait(10)

        const entry = await cache.getItem<ITestType>("test")

        expect(entry).toBeUndefined()
    })

    it("Should ignore isLazy and ttl options if isCachedForever option is provided and cache forever", async () => {
        const cache = new CacheContainer(new MemoryStorage())

        await cache.setItem("test", data, {
            ttl: 0,
            isLazy: false,
            isCachedForever: true
        })

        await wait(10)

        const entry = await cache.getItem<ITestType>("test")

        expect(entry).toStrictEqual(data)
    })

    it("Should unset key", async () => {
        const cache = new CacheContainer(new MemoryStorage())

        await cache.setItem("test", data, {
            ttl: 10,
            isLazy: false,
            isCachedForever: true
        })

        await wait(10)

        const entry = await cache.getItem<ITestType>("test")

        expect(entry).toStrictEqual(entry)

        cache.unset("test")

        const newItem = await cache.getItem<ITestType>("test")

        expect(newItem).toBeUndefined()
    })

    it("Should check if cache has key", async () => {
        const cache = new CacheContainer(new MemoryStorage())

        await cache.setItem("test", data, {
            ttl: 10,
            isLazy: false,
            isCachedForever: true
        })

        await wait(10)

        expect(await cache.has("test")).toBe(true)
        expect(await cache.has("nonexistent")).toBe(false)

        cache.unset("test")

        expect(await cache.has("test")).toBe(false)
    })
})

function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}
