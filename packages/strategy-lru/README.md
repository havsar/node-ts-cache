## LruStrategy

LRU (last-recently-used) strategy for [node-ts-cache](https://github.com/havsar/node-ts-cache) module.

Cached items will be removed based on usage. Cache items limit can be configured.

-   `max`: _(Default: 60)_ Number of seconds to expire the cachte item
-   `isLazy`: _(Default: true)_ If true, expired cache entries will be deleted on touch. If false, entries will be deleted after the given _ttl_.
-   `isCachedForver`: _(Default: false)_ If true, cache entry has no expiration.

```ts
import {Cache} from "node-ts-cache"
import {ExpirationStrategy} from "node-ts-cache-strategy-expiration"
import {MemoryStorage} from "node-ts-cache-storage-memory"

const storage = new MemoryStorage()
const strategy = new ExpirationStrategy(storage)

export default class UserService {
    @Cache(strategy, { ttl: 10 })
    async findReposByUsername(username: string) {
        return [
            {
                id: 1,
                username: "user1"
            },
            {
                id: 2,
                username: "user2"
            }
        ]
    }
}
```
