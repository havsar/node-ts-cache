interface IKeyStrategy {
    getKey(
        className: string,
        methodName: string,
        args: unknown[]
    ): Promise<string> | string
}

export { IKeyStrategy }
