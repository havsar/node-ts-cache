[![Travis CI](https://img.shields.io/travis/havsar/node-ts-cache.svg)](https://travis-ci.org/havsar/node-ts-cache) 
[![David](https://img.shields.io/david/havsar/node-ts-cache.svg)](https://david-dm.org/havsar/node-ts-cache)
[![npm](https://img.shields.io/npm/v/node-ts-cache.svg)](https://www.npmjs.org/package/node-ts-cache)
[![The MIT License](https://img.shields.io/npm/l/node-ts-cache.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/node-ts-cache.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-ts-cache/)

# node-ts-cache
Simple and extensible caching module supporting decorators

<!-- TOC depthTo:1 -->

- [node-ts-cache](#node-ts-cache)
- [Install](#install)
- [Usage](#usage)
- [@Cache](#cache)
- [Strategies](#strategies)
- [Storages](#storages)
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
    
    @Cache(myStrategy, { ttl: 60 })
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
        await myCache.setItem("users", newUsers, {  ttl: 60});

        return newUsers;
    }
}
```

# @Cache
Caches function response using the given options. Works with different strategies and storages. Uses all arguments to build an unique key.

`@Cache(strategy, options)`
- *`strategy`*: A supported caching [Strategy](#strategies)
- *`options`*: Options passed to the strategy for this particular method

*Note: @Cache always converts the method response to a promise because caching might be async.* 

# Strategies
## ExpirationStrategy
Cached items expire after a given amount of time.
`Options`
 - *`ttl`*: Number of seconds to expire the cachte item

# Storages
#### MemoryStorage()
#### FsJsonStorage(`fileName: string`)
#### RedisStorage(`host: string, port: number, password: string`)


# Test
```bash
npm test
```