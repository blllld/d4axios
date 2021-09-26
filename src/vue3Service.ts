import { ServiceConfigrationOptions } from '.'
import ServiceConfig, { getService } from './ServiceConfig'


export function createService(configs: ServiceConfigrationOptions = {}) {
    const axiosProxy = ServiceConfig(configs);
    return {
        install(VueConfig) {
            VueConfig.config.globalProperties.$axios = axiosProxy;
        }
    }
}

export function useService(service: any) {
    return getService(service);
}