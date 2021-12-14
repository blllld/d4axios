export { default as After } from './decorator/methods/After'
export { default as Header } from './decorator/methods/Header'
export { default as Download } from './decorator/methods/http/Download'
export { default as Get } from './decorator/methods/http/Get'
export { default as Post } from './decorator/methods/http/Post'
export { default as Upload } from './decorator/methods/http/Upload'
export { default as RestOnly } from './decorator/methods/RestOnly'
export { default as SendParam } from './decorator/methods/SendParam'
export { default as Prefix, default as RequestPrefix } from './decorator/RequestPrefix'
export { default as Service } from './decorator/Service'
export { default as mapService } from './decorator/ServiceMap'
export { default as Use } from './decorator/Use'
export { default as VueServiceBind } from './decorator/vue/VueServiceBind'
export { default as serviceConfig } from './ServiceConfig'
export { createService, useService } from './vue3Service'
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

type Picked<T, K extends keyof T> = {
    [P in K]: T[P] extends (...args: any[]) => any
    ? ReturnType<T[P]> extends Promise<any>
    ? <S>(...args: Parameters<T[P]>) => Promise<ResponseDataType<S>>
    : (...args: Parameters<T[P]>) => T[P]
    : T[P]
};
/** declare your return data */
declare global {
    type S<F> = Picked<F, keyof F>;
    export interface ResponseDataType<T> { }
}

export declare type ServiceConfigrationOptions = {
    axios?: AxiosInstance | AxiosRequestConfig,
    beforeRequest?: (requestArgs: object) => any,
    beforeResponse?: (response: object) => any,
    interceptors?: {
        request?: {
            use: <T = AxiosRequestConfig>(value: T) => T | Promise<T>,
            reject?: (error: any) => any
        },
        response?: {
            use: <T = AxiosResponse>(value: T) => T | Promise<T>,
            reject?: (error: any) => any
        }
    }
};

export declare type RequestConfig = { method: string, url: string, doRequest: any, fullReturn?: boolean }

export declare type TypeOriginMethod = {
    (...args: any[]): any,
    $sends?: { name: string, defaultValue: any }[],
    $rest?: { name: string, defaultValue: any }[],
    $headers?: object | ((args: any) => any)
    $afterhandler?: (...args: any) => any
}

export declare type Constructor<T> = new (...args: any[]) => T;


