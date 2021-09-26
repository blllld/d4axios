import { getService } from '../ServiceConfig'
import ServiceError, { ERROR } from '../ServiceError'

/**
 * 在不使用组件装饰器的情况下使用服务
 * @param args 
 * @returns 
 */
export default function ServiceMap(...args: any[]) {
    if (args.length == 0) {
        return new ServiceError(ERROR.Empty)
    }

    return args.reduce((services, service) => {
        if (service.__name === undefined) {
            throw new ServiceError(ERROR.NoService(service.name))
        }
        return (services[service.__name] = { get() { return getService(service) } }), services;
    }, {} as any)
}