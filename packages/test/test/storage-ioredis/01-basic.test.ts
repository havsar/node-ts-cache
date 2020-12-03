import * as Assert from "assert"
import * as IORedis from "ioredis"
import { IoRedisStorage } from "node-ts-cache-storage-ioredis"
import { CacheContainer } from "node-ts-cache"

const IoRedisMock: typeof IORedis = require("ioredis-mock")

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

describe("01-basic", () => {
    const ioRedis = new IoRedisMock()
    const storage = new IoRedisStorage(ioRedis)
    const strategy = new CacheContainer(storage)

    beforeEach(async () => {
        await strategy.clear()
    })

    it("Should initialize Redis storage correctly", async () => {
        Assert(strategy !== null)
        Assert(strategy !== undefined)
    })

    it("Should clear empty storage correctly", async () => {
        await strategy.clear()
    })

    it("Should return undefined if an item does not exist", async () => {
        const data = await strategy.getItem("not-existing-key")

        Assert(data === undefined)
    })

    it("Should set item without error", async () => {
        await strategy.setItem(
            "user",
            {
                name: "max",
                age: 18
            },
            { ttl: 1, isLazy: true }
        )
    })

    it("Should set and get item correctly", async () => {
        const raw = {
            files: ["image.png", "test.mp3"],
            color: "RED",
            level: 182
        }

        await strategy.setItem("settings", raw, { ttl: 10, isLazy: true })

        const data = await strategy.getItem("settings")

        Assert.notStrictEqual(data, raw)
    })

    it("Should return undefined if set item is expired", async () => {
        const raw = {
            username: "max123"
        }

        await strategy.setItem("user", raw, { ttl: 0.1, isLazy: true })

        await sleep(200)

        const data = await strategy.getItem("user")

        Assert.strictEqual(data, undefined)
    })
})
