export abstract class AbstractBaseKeyStrategy {
    constructor() {}

    public abstract getKey(className: string, methodName: string, args: any[]): Promise<string> | string;
}