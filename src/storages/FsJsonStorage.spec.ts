import * as Assert from "assert";
import * as Fs from "fs";
import { FsJsonStorage } from './FsJsonStorage';

describe("FsJsonStorage", () => {
    it("Should create file on storage construction", done => {
        const storage = new FsJsonStorage();

        Fs.readFileSync("cache.json");
        Fs.unlinkSync("cache.json");
        done();
    });

    it("Should be empty cache file on storage construction", done => {
        const storage = new FsJsonStorage();

        const cache = Fs.readFileSync("cache.json");

        Assert.equal(cache, "{}");
 
        Fs.unlinkSync("cache.json");
        done();
    });

    it("Should add cache item correctly", done => {
        const storage = new FsJsonStorage();
        const cacheKey = "test";
        const content = { username: "test", password: "test" };

        storage.setItem(cacheKey, content);
        const cache = JSON.parse(Fs.readFileSync("cache.json").toString());

        Assert.deepStrictEqual(storage.getItem(cacheKey), content);
        Assert.deepStrictEqual(cache, { [cacheKey]: content });

        Fs.unlinkSync("cache.json");
        done();
    });
});