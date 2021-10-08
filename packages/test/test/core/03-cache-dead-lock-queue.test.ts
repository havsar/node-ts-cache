import { Cache, CacheContainer } from "node-ts-cache"
import * as _ from "lodash"
import * as Fs from "fs"
import { NodeFsStorage } from "node-ts-cache-storage-node-fs"
import { IoRedisStorage } from "node-ts-cache-storage-ioredis"
import { MemoryStorage } from "node-ts-cache-storage-memory"
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
    class TestClass {
        @Cache(cache, { ttl: 2 })
        public async getUsers() {
            return await this.expensiveMethod()
        }

        public async expensiveMethod() {
            return new Promise((resolve) => setTimeout(() => resolve(data), 50))
        }
    }

    describe(`Cache Dead Lock Queue ${
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

        it("Should correctly enqueue simultaneous calls", async () => {
            const myClass = new TestClass()

            const expensiveMethodSpy = jest.spyOn(myClass, "expensiveMethod")
            const storageGetSpy = jest.spyOn(cache, "getItem")
            const storageSetSpy = jest.spyOn(cache, "setItem")

            const responses = await Promise.all(
                _.times(100).map(() => myClass.getUsers())
            )

            expect(storageSetSpy.mock.calls.length).toStrictEqual(1)
            expect(storageGetSpy.mock.calls.length).toStrictEqual(1)
            expect(expensiveMethodSpy.mock.calls.length).toStrictEqual(1)
            expect(responses).toStrictEqual(_.times(100, () => data))
        })
    })
}
