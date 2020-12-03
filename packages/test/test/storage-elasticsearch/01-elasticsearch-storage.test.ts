import { ElasticSearchStorage } from "node-ts-cache-storage-elasticsearch"
import { Client } from "@elastic/elasticsearch"
import * as Assert from "assert"
import { Cache, CacheContainer } from "node-ts-cache"

const elasticClient = new Client({
    node: "http://localhost:9200"
})

const storage = new ElasticSearchStorage(
    "node-ts-cache-user-cache",
    elasticClient
)

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

class TestClassOne {
    @Cache(new CacheContainer(storage))
    async getProjects() {
        return [
            {
                id: 343,
                title: "project-x"
            }
        ]
    }
}

describe("ElasticSearchStorage", () => {
    beforeEach(async () => {
        await storage.clear()
    })

    it("Should set item without issues", async () => {
        const container = new CacheContainer(storage)

        const user = {
            id: 335,
            username: "max"
        }

        await container.setItem("user-one", user, {})
    })

    it("Should set and get correct data from cache", async () => {
        const container = new CacheContainer(storage)

        const user = {
            id: 335,
            username: "max"
        }

        await container.setItem("user-two", user, {
            ttl: 5
        })

        const data = await container.getItem("user-two")

        Assert.deepStrictEqual(user, data)
    })

    it("Should return undefined if cache entry is expired", async () => {
        const container = new CacheContainer(storage)

        const user = {
            id: 335,
            username: "max"
        }

        await container.setItem("user-three", user, {
            ttl: 0.1
        })

        await sleep(0.2)

        const data = await container.getItem("user-three")

        Assert.deepStrictEqual(data, undefined)
    })

    it("Should work with decorator correctly", async () => {
        const testClass = new TestClassOne()

        const data = await testClass.getProjects()

        Assert.notDeepStrictEqual(data, undefined)
        Assert(typeof data === "object")
        Assert(data.length === 1)
    })
})
