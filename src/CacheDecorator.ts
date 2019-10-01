import { AbstractBaseStrategy } from './strategies/caching/AbstractBaseStrategy';
import { JSONStringifyKeyStrategy } from './strategies/key/JSONStringifyStrategy';
import { IKeyStrategy } from './strategies/key/IKeyStrategy';

const DefaultKeyStrategy = JSONStringifyKeyStrategy;

function Cache(cachingStrategy: AbstractBaseStrategy, options: any): Function;
function Cache(
    cachingStrategy: AbstractBaseStrategy,
    keyStrategy: IKeyStrategy,
    options: any
): Function;
function Cache(
    ...args: any[]
): Function {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        const cachingStrategy = args[0];

        let keyStrategy: IKeyStrategy;
        let options: any;

        if (args[1].getKey) {
            keyStrategy = args[1];
            options = args[2];
        } else {
            keyStrategy = new DefaultKeyStrategy();
            options = args[1];
        }

        const originalMethod = descriptor.value;
        const className = target.constructor.name;

        descriptor.value = async function (...args: any[]) {
            const cacheKey = await keyStrategy.getKey(className, methodName, args);

            const entry = await cachingStrategy.getItem(cacheKey);
            if (entry) {
                return entry;
            }

            const methodCall = originalMethod.apply(this, args);
            let methodResult;
            if (methodCall && methodCall.then) {
                methodResult = await methodCall;
            } else {
                methodResult = methodCall;
            }

            await cachingStrategy.setItem(cacheKey, methodResult, options);
            return methodResult;
        };

        return descriptor;
    };
}

export { Cache };