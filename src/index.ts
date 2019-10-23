import { RedisStorage } from './storage/redis.storage'
import { FsJsonStorage } from './storage/fs.json.storage'
import { MemoryStorage } from './storage/memory.storage'
import { ExpirationStrategy } from './strategy/caching/expiration.strategy'
import { IKeyStrategy } from './strategy/key/key.strategy.types'
import { ICacheStrategy } from './strategy/caching/cache.strategy.types'
import { Cache } from './decorator/cache.decorator'

export { Cache, ExpirationStrategy, MemoryStorage, FsJsonStorage, RedisStorage, IKeyStrategy, ICacheStrategy }
