[![CI](https://github.com/havsar/node-ts-cache/actions/workflows/ci.yml/badge.svg)](https://github.com/havsar/node-ts-cache/actions/workflows/ci.yml)
[![CI](https://github.com/havsar/node-ts-cache/actions/workflows/ci.yml/badge.svg?branch=development)](https://github.com/havsar/node-ts-cache/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/node-ts-cache.svg)](https://www.npmjs.org/package/node-ts-cache)
[![The MIT License](https://img.shields.io/npm/l/node-ts-cache.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/node-ts-cache.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-ts-cache/)

# node-ts-cache

Simple and extensible caching module supporting decorators.

# Install

```bash
npm install node-ts-cache
```

_Note: The underlying storage layer must be installed separately._

# Storages

| Storage                                                               	| Install                                         	|
|-----------------------------------------------------------------------	|-------------------------------------------------	|
| [memory](https://www.npmjs.com/package/node-ts-cache-storage-memory)  	| ```npm install node-ts-cache-storage-memory```  	|
| [node-fs](https://www.npmjs.com/package/node-ts-cache-storage-node-fs) 	| ```npm install node-ts-cache-storage-node-fs``` 	|
| [ioredis](https://www.npmjs.com/package/node-ts-cache-storage-ioredis) 	| ```npm install node-ts-cache-storage-ioredis``` 	|

# Usage

## With decorator

Caches function response using the given options.
Works with the above listed storages.
By default, uses all arguments to build an unique key.

`@Cache(container, options)`

-   `options`:
    -   `ttl`: _(Default: 60)_ Number of seconds to expire the cachte item
    -   `isLazy`: _(Default: true)_ If true, expired cache entries will be deleted on touch. If false, entries will be deleted after the given _ttl_.
    -   `isCachedForever`: _(Default: false)_ If true, cache entry has no expiration.
    -   `calculateKey(data => string)`: _(Default: JSON.stringify combination of className, methodName and call args)_
        -   `data`:
            -   `className`: The class name for the method being decorated
            -   `methodName`: The method name being decorated
            -   `args`: The arguments passed to the method when called

_Note: @Cache will consider the return type of the function. If the return type is a thenable, it will stay that way, otherwise not._

```ts
import { Cache, CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

const userCache = new CacheContainer(new MemoryStorage())

class MyService {
    @Cache(userCache, {ttl: 60})
    public async getUsers(): Promise<string[]> {
        return ["Max", "User"]
    }
}
```

## Directly

```ts
import { CacheContainer } from 'node-ts-cache'
import { MemoryStorage } from 'node-ts-cache-storage-memory'

const myCache = new CacheContainer(new MemoryStorage())

class MyService {
    public async getUsers(): Promise<string[]> {
        const cachedUsers = await myCache.getItem<string[]>("users")

        if (cachedUsers) {
            return cachedUsers
        }

        const newUsers = ["Max", "User"]

        await myCache.setItem("users", newUsers, {ttl: 60})

        return newUsers
    }
}
```

# Logging
This project uses [debug](https://github.com/visionmedia/debug) to log useful caching information.
Set environment variable **DEBUG=node-ts-cache** to enable logging.

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
