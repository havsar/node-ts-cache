import * as Assert from 'assert'
import NodeCacheStorage from '../src'

const storage = new NodeCacheStorage({});

describe('NodeCacheStorage', () => {
    it('Should add cache item correctly', async () => {
        const content = {data: {name: 'deep'}}
        const key = 'test'

        await storage.setItem(key, content)
        Assert.deepStrictEqual(await storage.getItem(key), content)
    })

    it('Should clear without errors', async () => {
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

