# Simple and extensible caching module supporting decorators

# Install
```bash
npm install --save node-ts-cache
```
or
```bash
yarn add node-ts-cache
```

# Usage
## With decoratots
```ts
import { Cache, ExpirationStrategy, MemoryStorage } from "node-ts-cache";

const myStrategy = new ExpirationStrategy(new MemoryStorage());

class MyService {
    
    @Cache(myStrategy, { ttl: 10000 })
    public getUsers(): string[] {
        return ["Max", "User"];
    }

    @Cache(myStrategy, { ttl: 10000 })
    public getUsersAsync(): Promise<string[]> {
        return Promise.resolve(["Max", "User"]);
    }
}
```

# Features
- MemoryStorage, FsJsonStorage
- ExpirationStrategy
- Cache decorator
- Async/Thenable methods

# Limitations
- Using decorators, ponly class methods are supported

# Test
```bash
npm test
```