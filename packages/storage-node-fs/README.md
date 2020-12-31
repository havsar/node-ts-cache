Node.js file system storage module for [node-ts-cache](https://www.npmjs.com/package/node-ts-cache).

```bash
npm i node-ts-cache
npm i node-ts-cache-storage-node-fs
```

```ts
import { Cache, CacheContainer } from "node-ts-cache"
import { NodeFsStorage } from "node-ts-cache-storage-node-fs"

const userCache = new CacheContainer(new NodeFsStorage())

class MyService {
    @Cache(userCache, { ttl: 60 })
    public async getUsers(): Promise<string[]> {
        return ["Max", "User"]
    }
}
```
