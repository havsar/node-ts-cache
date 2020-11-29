import { Cache } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'
import { ExpirationStrategy } from 'node-ts-cache-strategy-expiration'
import Got from 'got'
import CustomKeyCreator from './custom-key-creator'

const storage = new MemoryStorage()
const strategy = new ExpirationStrategy(storage)

export default class GithubRepoServiceMemory {
    @Cache(strategy, { ttl: 10 }, new CustomKeyCreator())
    async findReposByUsername(username: string) {
        return Got.get(`https://api.github.com/users/${username}/repos`, {
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        }).json()
    }
}
