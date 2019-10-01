import {RedisStorage} from './storages/RedisStorage';
import {FsJsonStorage} from './storages/FsJsonStorage';
import {MemoryStorage} from './storages/MemoryStorage';
import {ExpirationStrategy} from './strategies/caching/ExpirationStrategy';
import {Cache} from './CacheDecorator';
import {IKeyStrategy} from './strategies/key/IKeyStrategy';
import {ICacheStrategy} from './strategies/caching/ICacheStrategy';

export {Cache, ExpirationStrategy, MemoryStorage, FsJsonStorage, RedisStorage, IKeyStrategy, ICacheStrategy};