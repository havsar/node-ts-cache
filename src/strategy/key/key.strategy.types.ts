interface IKeyStrategy {
    getKey(className: string, methodName: string, args: any[]): Promise<string> | string;
}

export { IKeyStrategy }
