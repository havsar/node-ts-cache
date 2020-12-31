In-Memory storage module for [node-ts-cache](https://www.npmjs.com/package/node-ts-cache).

```bash
npm i node-ts-cache
npm i node-ts-cache-storage-memory
```

```ts
import { Cache, CacheContainer } from "node-ts-cache"
import { MemoryStorage } from "node-ts-cache-storage-memory"

const userCache = new CacheContainer(new MemoryStorage())

class MyService {
    @Cache(userCache, { ttl: 60 })
    public async getUsers(): Promise<string[]> {
        return ["Max", "User"]
    }
}
```
