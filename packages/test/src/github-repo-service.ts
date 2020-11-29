import IORedisStorage from "node-ts-cache-storage-ioredis"
import { Cache } from "node-ts-cache"
import { ExpirationStrategy } from "node-ts-cache-strategy-expiration"
import * as IORedis from "ioredis"
import Got from "got"
import CustomKeyCreator from "./custom-key-creator"

const ioRedis = new IORedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT ?? ""),
    db: 0,
    password: process.env.REDIS_PASSWORD
})
const storage = new IORedisStorage(ioRedis)
const strategy = new ExpirationStrategy(storage)

export default class GithubRepoService {
    @Cache(strategy, { ttl: 10 }, new CustomKeyCreator())
    async findReposByUsername(username: string) {
        return Got.get(`https://api.github.com/users/${username}/repos`, {
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        }).json()
    }
}
