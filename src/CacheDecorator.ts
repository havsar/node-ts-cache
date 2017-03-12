import { IStorage } from './storages/IStorage';
import { AbstractBaseStrategy } from './strategies/AbstractBaseStrategy';

export function Cache(cachingStrategy: AbstractBaseStrategy, options: object): Function {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        var originalMethod = descriptor.value;
        const className = target.constructor.name;

        descriptor.value = async function () {
            const cacheKey = `${className}:${methodName}:${JSON.stringify(arguments)}`;

            const entry = await cachingStrategy.getItem(cacheKey);
            if (entry) {
                return entry;
            }

            const methodCall = originalMethod.apply(this, arguments);
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
    }
}