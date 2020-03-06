import * as Proxyquire from 'proxyquire'
import * as Assert from 'assert'
import { RedisStorage } from '../ts-cache/src'

Proxyquire.noCallThru()

// @ts-ignore
import * as  RedisMock from 'ioredis-mock';

const MockedRedis = new RedisMock({
    host: 'host',
    port: 123,
    password: 'pass'
});

const storage = new RedisStorage({}, MockedRedis);

describe('RedisStorage', () => {
    it('Should clear Redis without errors', async () => {
        await storage.clear()
    })

    it('Should delete cache item if set to undefined', async () => {
        await storage.setItem('test', undefined)

        Assert.strictEqual(await storage.getItem('test') , undefined);
    })

    it('Should return undefined if cache not hit', async () => {
        await storage.clear()
        const item = await storage.getItem('item123')

        Assert.strictEqual(item, undefined)
    })
})

