import fs from "fs"
import path from "path"
import { NodeFsStorage } from "node-ts-cache-storage-node-fs"

const cacheFile = path.join(__dirname, "cache-test.json")

describe("NodeFsStorage", () => {
    it("Should create file on storage construction", (done) => {
        const storage = new NodeFsStorage(cacheFile)

        storage.clear()

        fs.readFileSync(cacheFile)

        fs.unlinkSync(cacheFile)
        done()
    })

    it("Should be empty cache file on storage construction", (done) => {
        const storage = new NodeFsStorage(cacheFile)

        storage.clear()

        const cache = fs.readFileSync(cacheFile).toString()

        expect(cache).toStrictEqual("{}")

        fs.unlinkSync(cacheFile)
        done()
    })

    it("Should add cache item correctly", async () => {
        const storage = new NodeFsStorage(cacheFile)
        const cacheKey = "test"
        const content = { username: "test", password: "test" }

        await storage.setItem(cacheKey, content)

        const cache = JSON.parse(fs.readFileSync(cacheFile).toString())

        expect(cache).toStrictEqual({ [cacheKey]: content })

        const entry = await storage.getItem(cacheKey)

        expect(entry).toStrictEqual(content)

        fs.unlinkSync(cacheFile)
    })
})
