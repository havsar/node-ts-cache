import { MemoryStorage } from '../storages/MemoryStorage';
import * as Assert from "assert";
import { ExpirationStrategy } from './ExpirationStrategy';

interface ITestType {
    user: {
        name: string
    }
}

const key = "test";
const data: ITestType = {
    user: { name: "test" }
};

describe("ExpirationStrategy", () => {
    it("Should set cache item correctly", async () => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        await cacher.setItem(key, data, { ttl: 10 * 1000 });
        const entry = await cacher.getItem<ITestType>(key);

        Assert.deepStrictEqual(entry, data);
    });

    it("Should return no item if cache expires istantly", async () => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        await cacher.setItem(key, data, { ttl: -1 });
        const entry = await cacher.getItem<ITestType>(key);
        Assert.deepStrictEqual(entry, undefined);
    });
});