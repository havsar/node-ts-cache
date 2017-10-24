import {RedisStorage} from './storages/RedisStorage';
import {FsJsonStorage} from './storages/FsJsonStorage';
import {MemoryStorage} from './storages/MemoryStorage';
import {ExpirationStrategy} from './strategies/ExpirationStrategy';
import {Cache} from './CacheDecorator';

export {Cache, ExpirationStrategy, MemoryStorage, FsJsonStorage, RedisStorage};