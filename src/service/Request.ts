import { RequestConfig, TypeOriginMethod } from '..';
import { beforeRequest, beforeResponse } from '../ServiceConfig';
import ServiceError, { ERROR } from '../ServiceError';
import { isAllowParam, isEmptyObject, isFormData, isFunction, transfer2FormData, transferData, urlJoin, urlReplace } from '../utils';
import BaseService from './BaseService';

function refactorMethod(originalMethod: TypeOriginMethod, config: RequestConfig) {
    return async function (this: BaseService) {
        let callArgs = [].slice.call(arguments);
        let rtnArgs = await originalMethod.apply(this, callArgs)
        let sends = originalMethod.$sends ?? [];
        let rest = originalMethod.$rest ?? [];
        let afterhandler = originalMethod.$afterhandler ?? ((args: any) => args);
        let shouldTransferFormData = false;

        // 处理请求参数
        if (!isAllowParam(rtnArgs)) {
            if (sends.length > 0) {
                rtnArgs = sends.reduce((args, { name, defaultValue }, index) => {
                    return (args[name] = callArgs[index] ?? defaultValue), args;
                }, {} as any)
            } else if (callArgs.length === 1) {
                let params = callArgs[0]
                if (isFormData(params)) {
                    shouldTransferFormData = true;
                }
                rtnArgs = transferData(params);
            } else {
                rtnArgs = {};
            }
        }

        // 处理请求url
        let originalURL = urlJoin(this.__prefix, config.url);
        let restParams = originalURL.match(/:(\w+)/g) ?? [];

        if (restParams.length > 0 && callArgs.length > 0) {
            if (callArgs.length > 0) {
                let rests: any = {};
                if (rest.length > 0) {
                    rest.forEach(({ name, defaultValue }, index) => {
                        rests[":" + name] = callArgs[index] ?? defaultValue;
                        rtnArgs[name] = undefined;
                    });
                } else {
                    restParams.forEach((matchKey) => {
                        rests[matchKey] = rtnArgs[matchKey.substring(1)]
                    })
                }
                originalURL = urlReplace(originalURL, rests);
                let checkRest = originalURL.match(/:(\w+)/g) ?? [];
                if (checkRest.length > 0) {
                    throw new ServiceError(ERROR.RestfulError(originalURL, restParams.length, restParams.length - checkRest.length));
                }

            } else {
                throw new ServiceError(ERROR.RestfulError(originalURL, restParams.length));
            }

        } else if (callArgs.length > 0 && isEmptyObject(rtnArgs)) {
            console.warn(`[d4axios] call arguments length is ${callArgs.length} but request params is empty,maybe you should use @SendParam to provide  params`)
        }

        // 请求前的hook
        let finalArgs = beforeRequest(transfer2FormData(rtnArgs, shouldTransferFormData));

        // 处理请求header
        let headers = originalMethod.$headers;
        if (isFunction(headers)) {
            headers = headers(finalArgs)
        }

        let response = await config.doRequest.call(this, originalURL, finalArgs, headers);

        if (config.fullReturn) {
            return response;
        }
        // 请求后的hook
        return afterhandler(beforeResponse(response.data, response));
    }
}

/**
 * 构建请求方法
 * @param config 
 * @returns 
 */
export default function Request(config: RequestConfig): any {
    return function (service: any, funName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) {
        descriptor.value = refactorMethod(descriptor.value, config);
        descriptor.writable = false
    }
}