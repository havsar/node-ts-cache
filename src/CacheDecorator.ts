import { IStorage } from './storages/IStorage';
import { AbstractBaseStrategy } from './strategies/AbstractBaseStrategy';

export function Cache(cachingStrategy: AbstractBaseStrategy, options: object) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        var originalMethod = descriptor.value;

        descriptor.value = function () {
            const cacheKey = methodName + JSON.stringify(arguments);

            const entry = cachingStrategy.getItem(cacheKey);
            if (entry) {
                return entry;
            }

            return Promise.resolve(originalMethod.apply(this, arguments)).then(function (result) {
                cachingStrategy.setItem(cacheKey, result, options);
                return result;
            });
        };

        return descriptor;
    }
}