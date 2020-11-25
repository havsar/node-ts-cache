import { IKeyStrategy } from './key.strategy.types'

class JSONStringifyKeyStrategy implements IKeyStrategy {
    public getKey(className: string, methodName: string, args: any[]): Promise<string> | string {
        return `${className}:${methodName}:${JSON.stringify(args)}`
    }
}

export { JSONStringifyKeyStrategy }
