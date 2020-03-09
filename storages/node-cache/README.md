# node-ts-cache-node-cache-storage
Node-Cache Storage module for node-ts-cache

wrapper for [node-cache](https://www.npmjs.com/package/node-cache)
```
import { Cache, ExpirationStrategy } from "node-ts-cache";
import NodeCacheStorage from 'node-ts-cache-node-cache-storage';

const myStrategy = new ExpirationStrategy(new NodeCacheStorage());
```
