import IoRedisStorage from '../src'
import * as IORedis from 'ioredis'
import { ExpirationStrategy } from '../../core/src'
import * as Assert from 'assert'

describe('01-basic', () => {
    const ioRedis = new IORedis({
        host: 'redis-13011.c233.eu-west-1-1.ec2.cloud.redislabs.com',
        port: 13011,
        db: 0,
        password: '6G64Cg0FpdkI7c7KmCbyXlgzxDX3HwZx'
    })
    const storage = new IoRedisStorage(ioRedis)
    const strategy = new ExpirationStrategy(storage)

    beforeEach(async () => {
        await strategy.clear()
    })

    it('Should initialize Redis storage correctly', async () => {
        Assert(strategy !== null)
        Assert(strategy !== undefined)
    })

    it('Should clear empty storage correctly', async () => {
        await strategy.clear()
    })

    it('Should return undefined if an item does not exist', async () => {
        const data = await strategy.getItem('not-existing-key')

        Assert(data === undefined)
    })

    it('Should set item without error', async () => {
        await strategy.setItem('user', {
            name: 'max',
            age: 18
        }, {ttl: 1})
    })

    it('Should set and get item correctly', async () => {
        await strategy.setItem('df', {}, {ttl: 1})
    })
})

