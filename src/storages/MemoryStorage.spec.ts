import * as Assert from "assert";
import { MemoryStorage } from './MemoryStorage';

describe("MemoryStorage", () => {
    it("Should add cache item correctly", done => {
        const storage = new MemoryStorage();
        const content = { data: { name: "deep" } };
        const key = "test";

        storage.setItem(key, content);
        Assert.equal(storage.getItem(key), content);

        done();
    });
});