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

describe("ExpiringCacher", () => {
    it("Should set cache item correctly", done => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        cacher.setItem(key, data, { ttl: 10 * 1000 });
        const entry = cacher.getItem<ITestType>(key);

        Assert.deepStrictEqual(entry, data);

        done();
    });

    it("Should return no item if cache expires istantly", done => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        cacher.setItem(key, data, { ttl: 0 });
        setTimeout(() => {
            const entry = cacher.getItem<ITestType>(key);
            Assert.deepStrictEqual(entry, undefined);
            done();
        }, 1);
    });

    it("Should return no item if cache expires normally", done => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        cacher.setItem(key, data, { ttl: 50 });
        setTimeout(() => {
            const entry = cacher.getItem<ITestType>(key);
            Assert.deepStrictEqual(entry, undefined);
            done();
        }, 51);
    });
});