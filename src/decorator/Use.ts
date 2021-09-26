import { getService } from '../ServiceConfig'
/**
 * 注入服务到当前对象中
 * @param service 
 * @returns 
 */
export default function Prop(service: any): any {
    return function (target: any, key: string) {
        target.constructor.prototype[key] = getService(service);
    };
}