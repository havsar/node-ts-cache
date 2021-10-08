import { Cache, CacheContainer } from "node-ts-cache"
import { MemoryStorage } from "node-ts-cache-storage-memory"
import { NodeFsStorage } from "node-ts-cache-storage-node-fs"
import * as Fs from "fs"
import { IoRedisStorage } from "node-ts-cache-storage-ioredis"
import * as IORedis from "ioredis"

const IoRedisMock: typeof IORedis = require("ioredis-mock")

const fsCacheFile = "user-cache.json"

const caches = [
    new CacheContainer(new MemoryStorage()),
    new CacheContainer(new NodeFsStorage(fsCacheFile)),
    new CacheContainer(new IoRedisStorage(new IoRedisMock()))
]

const data = ["user", "max", "test"]

caches.forEach((c) => testForCache(c))

function testForCache(cache: CacheContainer) {
    class TestClassOne {
        @Cache(cache, { ttl: 1 })
        public getUsers(): string[] {
            return data
        }

        @Cache(cache, { ttl: 1 })
        public getUsersPromise(): Promise<string[]> {
            return Promise.resolve(data)
        }
    }

    class TestClassTwo {
        @Cache(cache, { ttl: 1 })
        public async getUsers(): Promise<string[]> {
            return new Promise<string[]>((resolve) => {
                setTimeout(() => resolve(data), 200)
            })
        }
    }

    class TestClassCustomKey {
        @Cache(cache, { ttl: 1, calculateKey: (data) => data.methodName })
        public getUsers(): string[] {
            return data
        }

        @Cache(cache, { ttl: 1, calculateKey: (data) => data.methodName })
        public getUsersPromise(): Promise<string[]> {
            return Promise.resolve(data)
        }
    }

    class TestClassFour {
        @Cache(cache, { ttl: 1, calculateKey: (data) => data.methodName })
        public getUsersPromise(): Promise<string[]> {
            return Promise.resolve(data)
        }
    }

    describe(`CacheDecorator ${
        (cache as any).storage.constructor.name
    }`, () => {
        beforeEach(async () => {
            await cache.clear()
        })

        afterEach(async () => {
            try {
                await Fs.unlinkSync(fsCacheFile)
            } catch (e) {}
        })

        it("Should decorate function with ExpirationStrategy correctly", async () => {
            const myClass = new TestClassOne()
            await myClass.getUsersPromise()
        })

        it("Should cache function call correctly", async () => {
            const myClass = new TestClassOne()

            const users = await myClass.getUsers()

            expect(data).toStrictEqual(users)
            expect(
                await cache.getItem<string[]>("TestClassOne:getUsers:[]")
            ).toStrictEqual(data)
        })

        it("Should cache Promise response correctly", async () => {
            const myClass = new TestClassOne()

            await myClass.getUsersPromise().then(async (response) => {
                expect(data).toStrictEqual(response)
                expect(
                    await cache.getItem<string[]>(
                        "TestClassOne:getUsersPromise:[]"
                    )
                ).toStrictEqual(data)
            })
        })

        it("Should cache async response correctly", async () => {
            const myClass = new TestClassTwo()

            const users = await myClass.getUsers()
            expect(data).toStrictEqual(users)
            expect(
                await cache.getItem<string[]>("TestClassTwo:getUsers:[]")
            ).toStrictEqual(data)
        })

        it("Should cache function call correctly (custom key strategy)", async () => {
            const myClass = new TestClassCustomKey()

            const users = await myClass.getUsers()

            expect(data).toStrictEqual(users)
            expect(await cache.getItem<string[]>("getUsers")).toStrictEqual(
                data
            )
        })

        it("Should cache Promise response correctly (custom key strategy)", async () => {
            const myClass = new TestClassCustomKey()

            await myClass.getUsersPromise().then(async (response) => {
                expect(data).toStrictEqual(response)
                expect(
                    await cache.getItem<string[]>("getUsersPromise")
                ).toStrictEqual(data)
            })
        })

        it("Should cache users with async custom key strategy correctly", async () => {
            const myClass = new TestClassFour()

            await myClass.getUsersPromise().then(async (response) => {
                expect(data).toStrictEqual(response)
                expect(
                    await cache.getItem<string[]>("getUsersPromise")
                ).toStrictEqual(data)
            })
        })
    })
}
