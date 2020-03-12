import { ISyncKeyStrategy } from "../../index";

class JSONStringifyKeyStrategy implements ISyncKeyStrategy {
  public getKey(
    className: string,
    methodName: string,
    args: any[]
  ): string {
    return `${className}:${methodName}:${JSON.stringify(args)}`;
  }
}

export { JSONStringifyKeyStrategy };
