// storages
export  { RedisStorage } from './storage/redis.storage'
export { NodeCacheStorage } from './storage/node-cache.storage'
export  { FsJsonStorage } from './storage/fs.json.storage'
export  { MemoryStorage } from './storage/memory.storage'

// interfaces
import { ExpirationStrategy } from './strategy/caching/expiration.strategy'
import { IKeyStrategy } from './strategy/key/key.strategy.types'
import { ICacheStrategy } from './strategy/caching/cache.strategy.types'
import { Cache } from './decorator/cache.decorator'

export { Cache, ExpirationStrategy, IKeyStrategy, ICacheStrategy }
