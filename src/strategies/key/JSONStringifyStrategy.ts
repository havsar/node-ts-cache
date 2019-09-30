import {AbstractBaseKeyStrategy} from './AbstractBaseStrategy';

export class JSONStringifyStrategy extends AbstractBaseKeyStrategy {
    public getKey(className: string, methodName: string, args: any[]): Promise<string> | string {
        return `${className}:${methodName}:${JSON.stringify(args)}`;
    }
}