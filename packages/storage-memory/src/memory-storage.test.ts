import { Cache, CacheContainer } from "node-ts-cache"
import { MemoryStorage } from "node-ts-cache-storage-memory"

describe("MemoryStorage", () => {
    it("Should add cache item correctly", async () => {
        const storage = new MemoryStorage()
        const content = { data: { name: "deep" } }
        const key = "test"

        await storage.setItem(key, content)

        expect(await storage.getItem(key)).toStrictEqual(content)
    })

    it("Should work with a simple string", async () => {
        const storage = new MemoryStorage()
        const content = "mystring123"
        const key = "key1"

        await storage.setItem(key, content)

        expect(await storage.getItem(key)).toStrictEqual(content)
    })

    it("Should work with multiple entries", async () => {
        const storage = new MemoryStorage()

        await storage.setItem("k1", "c1")
        await storage.setItem("k2", "c2")

        expect(await storage.getItem("k1")).toStrictEqual("c1")
        expect(await storage.getItem("k2")).toStrictEqual("c2")
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

        expect(origData).toStrictEqual(users)
    })
})
