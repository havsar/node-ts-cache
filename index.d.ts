import { RedisStorage } from './src/storages/RedisStorage';
import { FsJsonStorage } from './src/storages/FsJsonStorage';
import { MemoryStorage } from './src/storages/MemoryStorage';
import { ExpirationStrategy } from './src/strategies/ExpirationStrategy';
import { Cache } from './src/CacheDecorator';
import { AbstractBaseStrategy } from './src/strategies/AbstractBaseStrategy';

export { Cache, ExpirationStrategy, MemoryStorage, FsJsonStorage, RedisStorage };