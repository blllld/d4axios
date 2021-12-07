import axios, { AxiosInstance } from 'axios';
import { ServiceConfigrationOptions } from '.';
import ServiceError, { ERROR } from './ServiceError';
import { isAxiosInstance, proxySupport } from './utils';
/**
 * 实例单例
 */
let globalAxios: AxiosInstance & {
    $get?: AxiosInstance['get'],
    $post?: AxiosInstance['post'],
};

/**
 * 请求前的操作
 */
export let beforeRequest: (...args: any[]) => any;

/**
 * 请求后操作
 */
export let beforeResponse: (...args: any[]) => any;

/**
 * 服务单例
 */
const services = new Map<string, any>();

export function getAxios() {
    if (globalAxios == undefined) {
        throw new ServiceError(ERROR.Init);
    }
    return globalAxios;
}

/**
 * 获取一个服务
 * @param service 
 * @returns 
 */
export function getService<T>(service: any): S<T> {
    return services.get(service.__name) || setService(service);
}

export function setService(service: any) {
    const newService = new service;
    newService.__prefix= service.__prefix;
    services.set(service.__name, newService);

    return proxySupport(newService)
}

/**
 * 服务配置
 * @param configs 
 */
export default function serviceConfig(configs: ServiceConfigrationOptions = {}) {
    if (isAxiosInstance(configs.axios)) {
        globalAxios = configs.axios;
    } else {
        globalAxios = axios.create(configs.axios)
    }
    beforeRequest = configs.beforeRequest ?? ((t: any) => t);
    beforeResponse = configs.beforeResponse ?? ((t: any) => t);

    globalAxios.interceptors.request.use(configs.interceptors?.request?.use, configs.interceptors?.request?.reject);
    globalAxios.interceptors.response.use(configs.interceptors?.response?.use, configs.interceptors?.response?.reject);
    return proxySupport(globalAxios)
}