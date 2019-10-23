import { RedisStorage } from './RedisStorage'
import * as Proxyquire from 'proxyquire'
import * as Sinon from 'sinon'
import * as Assert from 'assert'

Proxyquire.noCallThru()

const clientMock = {
    flushdbAsync: Sinon.fake(),
    setItem: Sinon.fake(),
    delAsync: Sinon.fake(),
    getAsync: Sinon.fake()
}

const RedisMock = {
    createClient: () => clientMock,
    RedisClient: {
        prototype: {}
    },
    Multi: {
        prototype: {}
    }
}
const MockRedisStorage: typeof RedisStorage = Proxyquire.load('./RedisStorage', {
    'redis': RedisMock
}).RedisStorage

const storage = new MockRedisStorage({
    host: 'host',
    port: 123,
    password: 'pass'
})

describe('RedisStorage', () => {
    it('Should clear Redis without errors', async () => {
        await storage.clear()
    })

    it('Should delete cache item if set to undefined', async () => {
        await storage.setItem('test', undefined)

        Assert.strictEqual(clientMock.delAsync.called, true)
        Assert.strictEqual(clientMock.delAsync.calledWith('test'), true)
        Assert.strictEqual(clientMock.setItem.called, false)
    })


    it('Should return undefined if cache not hit', async () => {
        await storage.clear()
        const item = await storage.getItem('item123')

        Assert.strictEqual(item, undefined)
    })

    it('Should throw an Error if connection to redis fails', async () => {
        const clientMock = {
            flushdbAsync: Sinon.stub().rejects(new Error('Redis connection failed')),
            setItem: Sinon.fake(),
            delAsync: Sinon.fake(),
            getAsync: Sinon.fake()
        }
        const RedisMock = {
            createClient: () => clientMock,
            RedisClient: {
                prototype: {}
            },
            Multi: {
                prototype: {}
            }
        }
        const MockRedisFailStorage: typeof RedisStorage = Proxyquire.load('./RedisStorage', {
            'redis': RedisMock
        }).RedisStorage

        const testStorage = new MockRedisFailStorage({
            host: 'unknown-host',
            port: 123,
            password: 'pass',
            connect_timeout: 1000
        })

        const errorMsg = 'Should have thrown an error, but did not'
        try {
            await testStorage.clear()
            await Promise.reject(errorMsg)
        } catch (error) {
            if (error === errorMsg) {
                Assert.fail('It id not throw an error')
            } else {
                Assert.ok(true)
            }
        }
    })
})
