import { IKeyStrategy } from 'node-ts-cache'

export default class CustomKeyCreator implements IKeyStrategy {
    getKey(className: string, methodName: string, _args: any[]): Promise<string> | string {
        return className + methodName.toString()
    }
}
