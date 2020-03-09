# node-ts-cache-rediusio-storage
RedisIO Storage module for node-ts-cache

```
import { Cache, ExpirationStrategy } from "node-ts-cache";
import RedisIOStorage from 'node-ts-cache-redisio-storage';

const myStrategy = new ExpirationStrategy(new RedisIOStorage());
```
