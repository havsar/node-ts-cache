[![Travis CI](https://img.shields.io/travis/havsar/node-ts-cache.svg)](https://travis-ci.org/havsar/node-ts-cache)
[![David](https://img.shields.io/david/havsar/node-ts-cache.svg)](https://david-dm.org/havsar/node-ts-cache)
[![npm](https://img.shields.io/npm/v/node-ts-cache.svg)](https://www.npmjs.org/package/node-ts-cache)
[![The MIT License](https://img.shields.io/npm/l/node-ts-cache.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/node-ts-cache.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-ts-cache/)

# node-ts-cache

Simple and extensible caching module supporting decorators.

**This is the documentation for v4 core.**

**If you are using a previous version, refer to the [v3](https://github.com/havsar/node-ts-cache/tree/v3) branch.**

# Install

```bash
npm install node-ts-cache
```

# Storages

-   `memory` https://www.npmjs.com/package/node-ts-cache-storage-memory
-   `node-fs` https://www.npmjs.com/package/node-ts-cache-storage-node-fs
-   `ioredis` https://www.npmjs.com/package/node-ts-cache-storage-ioredis
-   `elasticsearch` https://www.npmjs.com/package/node-ts-cache-storage-elasticsearch
-   `mongodb` https://www.npmjs.com/package/node-ts-cache-storage-mongodb

# Strategies

-   `expiration` https://www.npmjs.com/package/node-ts-cache-storage-memory
-   `lru` https://www.npmjs.com/package/node-ts-cache-storage-node-fs

# Usage

## With decorator

Caches function response using the given options.
Works with different strategies and storages.
By default, uses all arguments to build an unique key.

`@Cache(strategy, options)`

-   `strategy`: A supported caching [Strategy](#Strategies)
-   `options`: Options passed to the strategy for this particular method

_Note: @Cache always converts the method response to a promise because caching might be async._

```ts
import { Cache, ExpirationStrategy, MemoryStorage } from "node-ts-cache"

const myStrategy = new ExpirationStrategy(new MemoryStorage())

class MyService {
    @Cache(myStrategy, { ttl: 60 })
    public async getUsers(): Promise<string[]> {
        return ["Max", "User"]
    }
}
```

Cache decorator generates cache key according to class name, class method and args (with JSON.stringify).
If you want another key creation logic you can bypass key creation strategy to the Cache decorator.

```ts
import {
    Cache,
    ExpirationStrategy,
    MemoryStorage,
    IKeyStrategy
} from "node-ts-cache"

class MyKeyStrategy implements IKeyStrategy {
    public getKey(
        className: string,
        methodName: string,
        args: any[]
    ): Promise<string> | string {
        // Here you can implement your own way of creating cache keys
        return `foo bar baz`
    }
}

const myStrategy = new ExpirationStrategy(new MemoryStorage())
const myKeyStrategy = new MyKeyStrategy()

class MyService {
    @Cache(myStrategy, { ttl: 60 }, myKeyStrategy)
    public async getUsers(): Promise<string[]> {
        return ["Max", "User"]
    }
}
```

## Directly

```ts
import { ExpirationStrategy, MemoryStorage } from "node-ts-cache"

const myCache = new ExpirationStrategy(new MemoryStorage())

class MyService {
    public async getUsers(): Promise<string[]> {
        const cachedUsers = await myCache.getItem<string[]>("users")
        if (cachedUsers) {
            return cachedUsers
        }

        const newUsers = ["Max", "User"]
        await myCache.setItem("users", newUsers, { ttl: 60 })

        return newUsers
    }
}
```

# Development & Testing

This project follows the monorepo architecture using [lerna](https://github.com/lerna/lerna).
To start development and run tests for all the packages, run:

```bash
git clone git@github.com:havsar/node-ts-cache.git
cd node-ts-cache
npm i
npm run bootstrap
npm run test
```
