import {RedisStorage} from './storages/RedisStorage';
import {FsJsonStorage} from './storages/FsJsonStorage';
import {MemoryStorage} from './storages/MemoryStorage';
import {ExpirationStrategy} from './strategies/ExpirationStrategy';
import {Cache} from './CacheDecorator';
import {AbstractBaseStrategy} from './strategies/AbstractBaseStrategy';

export {Cache, ExpirationStrategy, MemoryStorage, FsJsonStorage, RedisStorage, AbstractBaseStrategy};
