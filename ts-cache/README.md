[![Travis CI](https://img.shields.io/travis/havsar/node-ts-cache.svg)](https://travis-ci.org/havsar/node-ts-cache)
[![David](https://img.shields.io/david/havsar/node-ts-cache.svg)](https://david-dm.org/havsar/node-ts-cache)
[![npm](https://img.shields.io/npm/v/node-ts-cache.svg)](https://www.npmjs.org/package/node-ts-cache)
[![The MIT License](https://img.shields.io/npm/l/node-ts-cache.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/node-ts-cache.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/node-ts-cache/)

# node-ts-cache

Simple and extensible caching module supporting decorators

<!-- TOC depthTo:2 -->

- [node-ts-cache](#node-ts-cache)
- [Install](#install)
- [Usage](#usage)
  - [With decorator](#with-decorator)
  - [Directly](#directly)
- [Strategies](#strategies)
  - [ExpirationStrategy](#expirationstrategy)
- [Storages](#storages)
- [Test](#test)

<!-- /TOC -->

# Install

```bash
npm install --save node-ts-cache
```

# Usage

## With decorator

Caches function response using the given options. Works with different strategies and storages. Uses all arguments to build an unique key.

`@Cache(strategy, options)`

- `strategy`: A supported caching [Strategy](#strategies)
- `options`: Options passed to the strategy for this particular method

_Note: @Cache always converts the method response to a promise because caching might be async._

```ts
import { Cache, ExpirationStrategy, MemoryStorage } from "node-ts-cache";

const myStrategy = new ExpirationStrategy(new MemoryStorage());

class MyService {
  @Cache(myStrategy, { ttl: 60 })
  public async getUsers(): Promise<string[]> {
    return ["Max", "User"];
  }
}
```

Cache decorator generates cache key according to class name, class method and args (with JSON.stringify).
If you want another key creation logic you can bypass key creation strategy to the Cache decorator.

```ts
import {
  Cache,
  ExpirationStrategy,
  IKeyStrategy,
  MemoryStorage
} from "node-ts-cache";

class MyKeyStrategy implements IKeyStrategy {
  public getKey(
    className: string,
    methodName: string,
    args: any[]
  ): Promise<string> | string {
    // Here you can implement your own way of creating cache keys
    return `foo bar baz`;
  }
}

const myStrategy = new ExpirationStrategy(new MemoryStorage());
const myKeyStrategy = new MyKeyStrategy();

class MyService {
  @Cache(myStrategy, { ttl: 60 }, myKeyStrategy)
  public async getUsers(): Promise<string[]> {
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
    await myCache.setItem("users", newUsers, { ttl: 60 });

    return newUsers;
  }
}
```

# Strategies

## ExpirationStrategy

Cached items expire after a given amount of time.

- `ttl`: _(Default: 60)_ Number of seconds to expire the cachte item
- `isLazy`: _(Default: true)_ If true, expired cache entries will be deleted on touch. If false, entries will be deleted after the given _ttl_.
- `isCachedForever`: _(Default: false)_ If true, cache entry has no expiration.

# Storages

| Storage          |                 Needed library                 |
| ---------------- | :--------------------------------------------: |
| FsStorage        |                   (bundled)                    |
| MemoryStorage    |                   (bundled)                    |
| RedisStorage     |   `npm install node-ts-cache-redis-storage`    |
| RedisIOStorage   |  `npm install node-ts-cache-redisio-storage`   |
| NodeCacheStorage | `npm install node-ts-cache-node-cache-storage` |
| LRUStorage       |       `npm install node-ts-lru-storage`        |

#### MemoryStorage()

in memory

```
import { Cache, ExpirationStrategy, MemoryStorage } from "node-ts-cache";

const myStrategy = new ExpirationStrategy(new MemoryStorage());
```

#### FsJsonStorage(`fileName: string`)

file based

```
import { Cache, ExpirationStrategy, FileStorage } from "node-ts-cache";

const myStrategy = new ExpirationStrategy(new FileStorage());
```

#### RedisStorage(`clientOpts:` [RedisClientOptions](https://github.com/NodeRedis/node_redis#options-object-properties))

redis client backend

```
import { Cache, ExpirationStrategy } from "node-ts-cache";
import RedisStorage from 'node-ts-cache-redis-storage';

const myStrategy = new ExpirationStrategy(new RedisStorage());
```

#### RedisIOStorage(`clientOpts:` [RedisIOClientOptions](https://github.com/NodeRedis/node_redis#options-object-properties))

redis io client backend

```
import { Cache, ExpirationStrategy } from "node-ts-cache";
import RedisIOStorage from 'node-ts-cache-redisio-storage';

const myStrategy = new ExpirationStrategy(new RedisIOStorage());
```

#### NodeCacheStorage(`options:` [NodeCacheOptions](https://www.npmjs.com/package/node-cache#options))

wrapper for [node-cache](https://www.npmjs.com/package/node-cache)

```
import { Cache, ExpirationStrategy } from "node-ts-cache";
import NodeCacheStorage from 'node-ts-cache-node-cache-storage';

const myStrategy = new ExpirationStrategy(new NodeCacheStorage());
```

#### LRUStorage(`options:` [LRUCacheOptions](https://www.npmjs.com/package/lru-cache#options))

wrapper for [lru-cache](https://www.npmjs.com/package/lru-cache)

```
import { Cache, ExpirationStrategy } from "node-ts-cache";
import LRUStorage from 'node-ts-cache-lru-storage';

const myStrategy = new ExpirationStrategy(new LRUStorage());
```

# Test

```bash
npm test
```
