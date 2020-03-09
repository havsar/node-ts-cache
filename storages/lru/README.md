# @hokify/node-ts-cache-lru-storage

LRU Storage module for node-ts-cache

wrapper for [lru-cache](https://www.npmjs.com/package/lru-cache)

```
import { Cache, ExpirationStrategy } from "@hokify/node-ts-cache";
import LRUStorage from 'node-ts-cache-lru-storage';

const myStrategy = new ExpirationStrategy(new LRUStorage());
```
