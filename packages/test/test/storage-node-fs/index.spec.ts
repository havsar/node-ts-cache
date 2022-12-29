import * as Fs from "fs"
import * as Path from "path"
import { NodeFsStorage } from "node-ts-cache"

const cacheFile = Path.join(__dirname, "cache-test.json")

describe("NodeFsStorage", () => {
    it("Should create file on storage construction", (done) => {
        const storage = new NodeFsStorage(cacheFile)

        storage.clear()

        Fs.readFileSync(cacheFile)

        Fs.unlinkSync(cacheFile)
        done()
    })

    it("Should be empty cache file on storage construction", (done) => {
        const storage = new NodeFsStorage(cacheFile)

        storage.clear()

        const cache = Fs.readFileSync(cacheFile).toString()

        expect(cache).toStrictEqual("{}")

        Fs.unlinkSync(cacheFile)
        done()
    })

    it("Should add cache item correctly", async () => {
        const storage = new NodeFsStorage(cacheFile)
        const cacheKey = "test"
        const content = { username: "test", password: "test" }

        await storage.setItem(cacheKey, content)

        const cache = JSON.parse(Fs.readFileSync(cacheFile).toString())

        expect(cache).toStrictEqual({ [cacheKey]: content })

        const entry = await storage.getItem(cacheKey)

        expect(entry).toStrictEqual(content)

        Fs.unlinkSync(cacheFile)
    })
})
