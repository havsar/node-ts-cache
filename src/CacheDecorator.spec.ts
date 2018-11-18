import { MemoryStorage } from './storages/MemoryStorage';
import { ExpirationStrategy } from './strategies/ExpirationStrategy';
import * as Assert from 'assert';
import { Cache } from './CacheDecorator';

const strategy = new ExpirationStrategy(new MemoryStorage());
const data = ['user', 'max', 'test'];

class TestClassOne {
    @Cache(strategy, {ttl: 1000})
    public getUsers(): string[] {
        return data;
    }

    @Cache(strategy, {ttl: 1000})
    public getUsersPromise(): Promise<string[]> {
        return Promise.resolve(data);
    }

}

class TestClassTwo {
    @Cache(strategy, {ttl: 20000})
    public async getUsers(): Promise<string[]> {
        return new Promise<string[]>(resolve => {
            setTimeout(() => resolve(data), 500);
        });
    }
}

describe('CacheDecorator', () => {

    beforeEach(async () => {
        await strategy.clear();
    });

    it('Should decorate function with ExpirationStrategy correctly', async () => {
        const myClass = new TestClassOne();
        await myClass.getUsersPromise();
    });

    it('Should cache function call correctly', async () => {
        const myClass = new TestClassOne();

        const users = await myClass.getUsers();

        Assert.strictEqual(data, users);
        Assert.strictEqual(await strategy.getItem<string[]>('TestClassOne:getUsers:[]'), data);
    });

    it('Should cache Promise response correctly', async () => {
        const myClass = new TestClassOne();

        await myClass.getUsersPromise().then(async response => {
            Assert.strictEqual(data, response);
            Assert.strictEqual(await strategy.getItem<string[]>('TestClassOne:getUsersPromise:[]'), data);
        });
    });

    it('Should cache async response correctly', async () => {
        const myClass = new TestClassTwo();

        const users = await myClass.getUsers();
        Assert.strictEqual(data, users);
        Assert.strictEqual(await strategy.getItem<string[]>('TestClassTwo:getUsers:[]'), data);
    });
});