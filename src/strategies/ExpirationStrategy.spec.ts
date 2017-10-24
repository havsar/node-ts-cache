import {MemoryStorage} from '../storages/MemoryStorage';
import * as Assert from "assert";
import {ExpirationStrategy} from './ExpirationStrategy';

interface ITestType {
    user: {
        name: string
    }
}

const data: ITestType = {
    user: {name: "test"}
};

describe("ExpirationStrategy", () => {
    it("Should set cache item correctly with isLazy", async () => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        await cacher.setItem("test", data, {ttl: 10});
        const entry = await cacher.getItem<ITestType>("test");

        Assert.deepStrictEqual(entry, data);
    });

    it("Should return no item if cache expires istantly with isLazy", async () => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        await cacher.setItem("test", data, {ttl: -1});
        const entry = await cacher.getItem<ITestType>("test");
        Assert.deepStrictEqual(entry, undefined);
    });

    it("Should not find cache item after ttl with isLazy disabled", async () => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        await cacher.setItem("test", data, {ttl: 0.001, isLazy: false});
        await wait(10);

        const entry = await cacher.getItem<ITestType>("test");
        Assert.deepStrictEqual(entry, undefined);
    });

    it("Should ignore isLazy and ttl options if isCachedForever option is provided and cache forever", async () => {
        const cacher = new ExpirationStrategy(new MemoryStorage());

        await cacher.setItem("test", data, {ttl: 0, isLazy: false, isCachedForever: true});
        await wait(10);

        const entry = await cacher.getItem<ITestType>("test");
        Assert.deepStrictEqual(entry, data);
    });
});

function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve, _reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}