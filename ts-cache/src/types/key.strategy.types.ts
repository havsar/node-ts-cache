interface ISyncKeyStrategy {
  getKey(
    className: string,
    methodName: string,
    args: any[]
  ): string;
}

interface IAsyncKeyStrategy {
  getKey(
      className: string,
      methodName: string,
      args: any[]
  ): Promise<string> | string;
}

export { IAsyncKeyStrategy, ISyncKeyStrategy };
