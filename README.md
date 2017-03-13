[![TRAVIS](https://travis-ci.org/havsar/node-ts-cache.svg?branch=master)](https://travis-ci.org/havsar/node-ts-cache.svg?branch=master)

[![NPM](https://nodei.co/npm/node-ts-cache.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-ts-cache/)

# node-ts-cache
Simple and extensible caching module supporting decorators

<!-- TOC depthTo:1 -->

- [node-ts-cache](#node-ts-cache)
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
## With decorator
```ts
import { Cache, ExpirationStrategy, MemoryStorage } from "node-ts-cache";

const myStrategy = new ExpirationStrategy(new MemoryStorage());

class MyService {
    
    @Cache(myStrategy, { ttl: 10 })
    public getUsers(): Promise<string[]> {
        return ["Max", "User"];
    }
}
```

## Directly
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
- *`options`*: Options passed to the strategy for this particular method (TTL in seconds)

*Note: @Cache always converts the method response to a promise because caching might be async.* 

# Test
```bash
npm test
```