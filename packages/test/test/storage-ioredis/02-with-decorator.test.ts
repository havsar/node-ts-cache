import * as IORedis from "ioredis"
import * as Sinon from "sinon"
import { IoRedisStorage } from "../../../node-ts-cache-storage-ioredis"
import { Cache, CacheContainer } from "node-ts-cache"

const IoRedisMock: typeof IORedis = require("ioredis-mock")

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

interface User {
    username: string
    level: number
}

const getUsersFromBackend = Sinon.stub().resolves([
    { username: "max", level: 13 },
    { username: "user-two", level: 34 },
    { username: "user-three", level: 127 }
])

describe("02-with-decorator", () => {
    const ioRedis = new IoRedisMock()
    const storage = new IoRedisStorage(ioRedis)
    const strategy = new CacheContainer(storage)

    beforeEach(async () => {
        await strategy.clear()
        getUsersFromBackend.resetHistory()
    })

    class TestClassOne {
        @Cache(strategy, { ttl: 0.3 })
        async getUsers(): Promise<User[]> {
            return await getUsersFromBackend()
        }
    }

    it("Should initialize class with decorator without issues", async () => {
        const testClassInstance = new TestClassOne()

        expect(testClassInstance).not.toBeUndefined()
        expect(testClassInstance).not.toBeNull()
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

        expect(users).toStrictEqual(usersAfter500ms)
    })

    it("Should not call backend call twice if cached", async () => {
        const testClassInstance = new TestClassOne()

        expect(getUsersFromBackend.callCount).toEqual(0)

        const users = await testClassInstance.getUsers()

        expect(getUsersFromBackend.callCount).toEqual(1)

        const usersAfter10ms = await testClassInstance.getUsers()

        expect(getUsersFromBackend.callCount).toEqual(1)
        expect(users).toStrictEqual(usersAfter10ms)
    })
})
