import { IKeyStrategy } from './IKeyStrategy';

export class JSONStringifyKeyStrategy implements IKeyStrategy {
    public getKey(className: string, methodName: string, args: any[]): Promise<string> | string {
        return `${className}:${methodName}:${JSON.stringify(args)}`;
    }
}