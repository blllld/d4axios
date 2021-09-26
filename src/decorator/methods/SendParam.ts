import { TypeOriginMethod } from "../..";

/**
 * 代表当前发送的参数列表
 * @param name 当前的参数名
 * @param defaultValue 未传参时的默认值
 * @returns 参数装饰器
 */
export default function SendParam(name: string, defaultValue: any = undefined) {
    return function (target: any, mname: string, index: number) {
        const originalFn = <TypeOriginMethod>target[mname];
        if (!originalFn.$sends) {
            originalFn.$sends = [];
        }
        originalFn.$sends[index] = { name, defaultValue };
    }
}