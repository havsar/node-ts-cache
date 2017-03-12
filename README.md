# Simple and extensible caching module supporting decorators

<!-- TOC depthTo:1 -->

- [Simple and extensible caching module supporting decorators](#simple-and-extensible-caching-module-supporting-decorators)
- [Install](#install)
- [Usage](#usage)
- [@Cache](#cache)
- [Test](#test)

<!-- /TOC -->

# Install
```bash
npm install --save node-ts-cache
```
or
```bash
yarn add node-ts-cache
```

# Usage
## With decoratots
```ts
import { Cache, ExpirationStrategy, MemoryStorage } from "node-ts-cache";

const myStrategy = new ExpirationStrategy(new MemoryStorage());

class MyService {
    
    @Cache(myStrategy, { ttl: 10000 })
    public getUsers(): Promise<string[]> {
        return ["Max", "User"];
    }
}
```

## Manual
```ts
import { ExpirationStrategy, MemoryStorage } from "node-ts-cache";

const myCache = new ExpirationStrategy(new MemoryStorage());

class MyService {
    
    public async getUsers(): Promise<string[]> {
        const cachedUsers = await myCache.getItem<string[]>("users");
        if (cachedUsers) {
            return cachedUsers;
        }

        const newUsers = ["Max", "User"];
        await myCache.setItem("users", newUsers);

        return newUsers;
    }
}
```

# @Cache
Makes it possible to easy cache a method response.

`@Cache(strategy, options)`
- *`strategy`*: A caching strategy (ExpirationStrategy)
- *`options`*: Options passed to the strategy for this particular method (TTL)

*Note: @Cache always converts the method response to a promise because caching might be async.* 

# Test
```bash
npm test
```