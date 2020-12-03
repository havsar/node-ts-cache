import * as Assert from "assert"
import { MemoryStorage } from "node-ts-cache-storage-memory"
import { Cache } from "node-ts-cache"
import CacheContainer from "node-ts-cache/dist/cache-container/cache-container"

const userCache = new CacheContainer(new MemoryStorage())
const data = ["user", "max", "test"]

class TestClassOne {
    @Cache(userCache, { ttl: 1 })
    public getUsers(): string[] {
        return data
    }

    @Cache(userCache, { ttl: 1 })
    public getUsersPromise(): Promise<string[]> {
        return Promise.resolve(data)
    }
}

class TestClassTwo {
    @Cache(userCache, { ttl: 1 })
    public async getUsers(): Promise<string[]> {
        return new Promise<string[]>((resolve) => {
            setTimeout(() => resolve(data), 200)
        })
    }
}

class TestClassCustomKey {
    @Cache(userCache, { ttl: 1, calculateKey: (data) => data.methodName })
    public getUsers(): string[] {
        return data
    }

    @Cache(userCache, { ttl: 1, calculateKey: (data) => data.methodName })
    public getUsersPromise(): Promise<string[]> {
        return Promise.resolve(data)
    }
}

class TestClassFour {
    @Cache(userCache, { ttl: 1, calculateKey: (data) => data.methodName })
    public getUsersPromise(): Promise<string[]> {
        return Promise.resolve(data)
    }
}

describe("CacheDecorator", () => {
    beforeEach(async () => {
        await userCache.clear()
    })

    it("Should decorate function with ExpirationStrategy correctly", async () => {
        const myClass = new TestClassOne()
        await myClass.getUsersPromise()
    })

    it("Should cache function call correctly", async () => {
        const myClass = new TestClassOne()

        const users = await myClass.getUsers()

        Assert.strictEqual(data, users)
        Assert.strictEqual(
            await userCache.getItem<string[]>("TestClassOne:getUsers:[]"),
            data
        )
    })

    it("Should cache Promise response correctly", async () => {
        const myClass = new TestClassOne()

        await myClass.getUsersPromise().then(async (response) => {
            Assert.strictEqual(data, response)
            Assert.strictEqual(
                await userCache.getItem<string[]>(
                    "TestClassOne:getUsersPromise:[]"
                ),
                data
            )
        })
    })

    it("Should cache async response correctly", async () => {
        const myClass = new TestClassTwo()

        const users = await myClass.getUsers()
        Assert.strictEqual(data, users)
        Assert.strictEqual(
            await userCache.getItem<string[]>("TestClassTwo:getUsers:[]"),
            data
        )
    })

    it("Should cache function call correctly (custom key strategy)", async () => {
        const myClass = new TestClassCustomKey()

        const users = await myClass.getUsers()

        Assert.strictEqual(data, users)
        Assert.strictEqual(await userCache.getItem<string[]>("getUsers"), data)
    })

    it("Should cache Promise response correctly (custom key strategy)", async () => {
        const myClass = new TestClassCustomKey()

        await myClass.getUsersPromise().then(async (response) => {
            Assert.strictEqual(data, response)
            Assert.strictEqual(
                await userCache.getItem<string[]>("getUsersPromise"),
                data
            )
        })
    })

    it("Should cache users with async custom key strategy correctly", async () => {
        const myClass = new TestClassFour()

        await myClass.getUsersPromise().then(async (response) => {
            Assert.strictEqual(data, response)
            Assert.strictEqual(
                await userCache.getItem<string[]>("getUsersPromise"),
                data
            )
        })
    })
})
