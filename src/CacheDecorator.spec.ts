import {MemoryStorage} from './storages/MemoryStorage';
import {ExpirationStrategy} from './strategies/ExpirationStrategy';
import * as Assert from "assert";
import {Cache} from './CacheDecorator';

const cacher = new ExpirationStrategy(new MemoryStorage());
const data = ["user", "max", "test"];

class TestClassOne {
    @Cache(cacher, {ttl: 1000})
    public getUsers(): string[] {
        return data;
    }

    @Cache(cacher, {ttl: 1000})
    public getUsersPromise(): Promise<string[]> {
        return Promise.resolve(data);
    }

}

class TestClassTwo {
    @Cache(cacher, {ttl: 10})
    public async getUsers(): Promise<string[]> {
        return data;
    }
}

describe("CacheDecorator", () => {
    it("Should decorate function with ExpiringCacher correctly", done => {
        cacher.clear();
        const myClass = new TestClassOne();
        myClass.getUsersPromise();
        done();
    });

    it("Should cache function call correctly", async () => {
        cacher.clear();
        const myClass = new TestClassOne();

        const users = await myClass.getUsers();

        Assert.equal(data, users);
        Assert.equal(await cacher.getItem<string[]>("TestClassOne:getUsers:[]"), data);
    });

    it("Should cache Promise response correctly", async () => {
        cacher.clear();
        const myClass = new TestClassOne();

        await myClass.getUsersPromise().then(async response => {
            Assert.equal(data, response);
            Assert.equal(await cacher.getItem<string[]>("TestClassOne:getUsersPromise:[]"), data);
        });
    });

    it("Should cache async respone correctly", async () => {
        cacher.clear();
        const myClass = new TestClassTwo();

        const users = await myClass.getUsers();
        Assert.equal(data, users);
        Assert.equal(await cacher.getItem<string[]>("TestClassTwo:getUsers:[]"), data);
    });
});