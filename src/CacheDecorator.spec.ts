import { MemoryStorage } from './storages/MemoryStorage';
import { ExpiringCacher } from './strategies/ExpiringCacher';
import * as Assert from "assert";
import * as Fs from "fs";
import { Cache } from './CacheDecorator';

const cacher = new ExpiringCacher(new MemoryStorage());
const data = ["user", "max", "test"];

class TestClassOne {
    @Cache(cacher, { ttl: 100 })
    public getUsers(): string[] {
        return data;
    }
}

describe("CacheDecorator", () => {
    it("Should decorate function with ExpiringCacher correctly", done => {
        const myClass = new TestClassOne();
        done();
    });

    it("Should cache function call correctly", done => {
        const myClass = new TestClassOne();

        const users = myClass.getUsers();

        Assert.equal(data, users);
        Assert.equal(cacher.getItem<string[]>("getUsers{}"), data);

        done();
    });
});