import * as Assert from "assert";
import { MemoryStorage } from './MemoryStorage';

describe("MemoryStorage", () => {
    it("Should add cache item correctly", async () => {
        const storage = new MemoryStorage();
        const content = { data: { name: "deep" } };
        const key = "test";

        await storage.setItem(key, content); 
        Assert.equal(await storage.getItem(key), content);
    });
});