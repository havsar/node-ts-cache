import * as Assert from "assert"
import { Cache, CacheContainer } from "node-ts-cache"
import { MemoryStorage } from "node-ts-cache-storage-memory"

describe("MemoryStorage", () => {
    it("Should add cache item correctly", async () => {
        const storage = new MemoryStorage()
        const content = { data: { name: "deep" } }
        const key = "test"

        await storage.setItem(key, content)

        Assert.strictEqual(await storage.getItem(key), content)
    })

    it("Should work with a simple string", async () => {
        const storage = new MemoryStorage()
        const content = "mystring123"
        const key = "key1"

        await storage.setItem(key, content)

        Assert.strictEqual(await storage.getItem(key), content)
    })

    it("Should work with multiple entries", async () => {
        const storage = new MemoryStorage()

        await storage.setItem("k1", "c1")
        await storage.setItem("k2", "c2")

        Assert.strictEqual(await storage.getItem("k1"), "c1")
        Assert.strictEqual(await storage.getItem("k1"), "c1")
    })

    it("Should work with decorator", async () => {
        const origData = ["user-123"]

        class TestClass {
            @Cache(new CacheContainer(new MemoryStorage()), {})
            async getUsers() {
                return origData
            }
        }

        const instance = new TestClass()

        const users = await instance.getUsers()

        Assert.strictEqual(origData, users)
    })
})
