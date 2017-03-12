import * as Assert from "assert";
import * as Fs from "fs";
import { FsJsonStorage } from './FsJsonStorage';

const cacheFile = "cache.json";

describe("FsJsonStorage", () => {
    it("Should create file on storage construction", done => {
        const storage = new FsJsonStorage(cacheFile);

        Fs.readFileSync(cacheFile);
        Fs.unlinkSync(cacheFile);
        done();
    });

    it("Should be empty cache file on storage construction", done => {
        const storage = new FsJsonStorage(cacheFile);

        const cache = Fs.readFileSync(cacheFile);

        Assert.equal(cache, "{}");
 
        Fs.unlinkSync(cacheFile);
        done();
    });

    it("Should add cache item correctly", done => {
        const storage = new FsJsonStorage(cacheFile);
        const cacheKey = "test";
        const content = { username: "test", password: "test" };

        storage.setItem(cacheKey, content);
        const cache = JSON.parse(Fs.readFileSync(cacheFile).toString());

        Assert.deepStrictEqual(storage.getItem(cacheKey), content);
        Assert.deepStrictEqual(cache, { [cacheKey]: content });

        Fs.unlinkSync(cacheFile);
        done();
    });
});