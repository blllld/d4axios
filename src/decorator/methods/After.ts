import { TypeOriginMethod } from "../..";

/**
 * 代表当前发送的请求头
 * @param name 当前的参数名
 * @param defaultValue 未传参时的默认值
 * @returns 参数装饰器
 */
export default function After(handler: (...args: any) => any) {
    return function (target: any, mname: string) {
        const originalFn = <TypeOriginMethod>target[mname];
        originalFn.$afterhandler = handler
    }
}