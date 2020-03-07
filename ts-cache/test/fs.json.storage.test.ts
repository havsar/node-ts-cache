import * as Assert from "assert";
import * as Fs from "fs";
import { FsJsonStorage } from "../src/storage/fs";

const cacheFile = "cache.json";

describe("FsJsonStorage", () => {
  it("Should create file on storage construction", done => {
    const storage = new FsJsonStorage(cacheFile);
    storage.clear();

    Fs.readFileSync(cacheFile);

    Fs.unlinkSync(cacheFile);
    done();
  });

  it("Should be empty cache file on storage construction", done => {
    const storage = new FsJsonStorage(cacheFile);
    storage.clear();

    const cache = Fs.readFileSync(cacheFile).toString();

    Assert.strictEqual(cache, "{}");

    Fs.unlinkSync(cacheFile);
    done();
  });

  it("Should add cache item correctly", async () => {
    const storage = new FsJsonStorage(cacheFile);
    const cacheKey = "test";
    const content = { username: "test", password: "test" };

    await storage.setItem(cacheKey, content);
    const cache = JSON.parse(Fs.readFileSync(cacheFile).toString());

    Assert.deepStrictEqual(cache, { [cacheKey]: content });
    const entry = await storage.getItem(cacheKey);
    Assert.deepEqual(entry, content);

    Fs.unlinkSync(cacheFile);
  });
});
