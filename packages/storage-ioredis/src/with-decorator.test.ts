import { IoRedisStorage } from "node-ts-cache-storage-ioredis"
import { Cache, CacheContainer } from "node-ts-cache"
import type { default as IORedis } from "ioredis"
const IoRedisMock: typeof IORedis = require('ioredis-mock')

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

interface User {
    username: string
    level: number
}

const getUsersFromBackend = jest.fn()
    .mockReturnValueOnce({ username: "max", level: 13 })
    .mockReturnValueOnce({ username: "user-two", level: 34 })
    .mockReturnValueOnce({ username: "user-three", level: 127 });

describe("02-with-decorator", () => {
    const ioRedis = new IoRedisMock()
    const storage = new IoRedisStorage(ioRedis)
    const strategy = new CacheContainer(storage)

    beforeEach(async () => {
        await strategy.clear()
        getUsersFromBackend.mockReset()
    })

    class TestClassOne {
        @Cache(strategy, { ttl: 0.3 })
        async getUsers(): Promise<User[]> {
            return await getUsersFromBackend()
        }
    }

    it("Should initialize class with decorator without issues", async () => {
        const testClassInstance = new TestClassOne()

        expect(testClassInstance).not.toStrictEqual(undefined)
        expect(testClassInstance).not.toStrictEqual(null)
    })

    it("Should call decorated method without issues", async () => {
        const testClassInstance = new TestClassOne()

        await testClassInstance.getUsers()
    })

    it("Should return users from cache correctly", async () => {
        const testClassInstance = new TestClassOne()

        const users = await testClassInstance.getUsers()

        await sleep(500)

        const usersAfter500ms = await testClassInstance.getUsers()

        expect(users).toEqual(usersAfter500ms)
    })

    it("Should not call backend call twice if cached", async () => {
        const testClassInstance = new TestClassOne()

        expect(getUsersFromBackend).toHaveBeenCalledTimes(0)

        const users = await testClassInstance.getUsers()

        expect(getUsersFromBackend).toHaveBeenCalledTimes(1)

        const usersAfter10ms = await testClassInstance.getUsers()

        expect(getUsersFromBackend).toHaveBeenCalledTimes(2)
        expect(users).toStrictEqual(usersAfter10ms)
    })
})
