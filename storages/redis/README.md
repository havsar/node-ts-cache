# node-ts-cache-redius-storage
Redis Storage module for node-ts-cache

```
import { Cache, ExpirationStrategy } from "node-ts-cache";
import RedisStorage from 'node-ts-cache-redis-storage';

const myStrategy = new ExpirationStrategy(new RedisStorage());
```
