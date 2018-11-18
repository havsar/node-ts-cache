import { AbstractBaseStrategy } from './strategies/AbstractBaseStrategy';

export function Cache(cachingStrategy: AbstractBaseStrategy, options: any): Function {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const className = target.constructor.name;

        descriptor.value = async function (...args: any[]) {
            const cacheKey = `${className}:${methodName}:${JSON.stringify(args)}`;

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
