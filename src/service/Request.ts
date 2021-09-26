import { ReuqestConfig, TypeOriginMethod } from '..';
import { beforeRequest, beforeResponse } from '../ServiceConfig';
import ServiceError, { ERROR } from '../ServiceError';
import { isObject, urlJoin, isAllowParam, dataType, urlReplace, isFunction } from '../utils';
import BaseService from './BaseService';

/**
 * 混入请求参数
 * @param rtnArgs 原方法运算返回
 * @param methodArgs 原方法参数列表
 * @param sendArgs `@SendParam` 参数列表
 * @param beforeRequest 请求前参数重写 
 * @returns 
 */
function mixinArgs(rtnArgs: any, methodArgs: any[], sendArgs: TypeOriginMethod['$sends'], beforeRequest) {
    // 函数有返回值，则使用返回值
    if (rtnArgs) {
        return beforeRequest(rtnArgs)
    }

    // 如果函数有请求参数，则需要将请求参数按条件展开
    let sends = {};
    if (methodArgs) {
        if (sendArgs) {
            sendArgs.forEach((arg, index) => {
                sends[arg.name] = methodArgs[index] ?? arg.defaultValue;
                methodArgs[index] = undefined;
            })
        }
        // 仅保留 object对象，并且会对对象做展开操作
        methodArgs.forEach(arg => {
            if (isObject(arg)) {
                sends = { ...arg, ...sends }
            }
        });

    }
    return beforeRequest(sends);
}

/**
 * 对传入的方法进行重构
 * @param originalMethod  原始方法
 * @param config 配置
 * @returns 
 */
function refactorMethod(originalMethod: TypeOriginMethod, config: ReuqestConfig) {
    return async function (this: BaseService) {
        let fullURL = urlJoin(this.__prefix, config.url); // 修正前的地址
        const restfulParams = fullURL.match(/:(\w+)/g);
        let headers = originalMethod.$headers; // 请求附带请求头
        const methodArgs = [].slice.call(arguments); // 当前请求参数
        const rtnArgs = await originalMethod.call(this, methodArgs); // 当前函数返回参数
        const sendArgs = originalMethod.$sends || []; // 当前请求标记名称
        const finalArgs = mixinArgs(rtnArgs, methodArgs, sendArgs, beforeRequest); // 最终请求参数

        if (restfulParams) {
            if (methodArgs.length == restfulParams.length && sendArgs.length == 0) {
                fullURL = urlReplace(fullURL, restfulParams, methodArgs)
            } else {
                fullURL = urlReplace(fullURL, restfulParams, finalArgs)
            }
        } else if (methodArgs.length > sendArgs.length) {
            console.warn(`Method of ${fullURL} Args Length is ${methodArgs.length} But @SendParam's Length is ${sendArgs.length}`);
        }

        if (rtnArgs && !isAllowParam(rtnArgs)) {
            throw new ServiceError(ERROR.ArgsError(fullURL, dataType(rtnArgs)));
        }

        if(isFunction(headers)){
            headers =  headers(finalArgs);
        }

        let response = await config.doRequest.call(this, fullURL, finalArgs, headers);
        return beforeResponse(response.data);
    }
}

/**
 * 构建请求方法
 * @param config 
 * @returns 
 */
export default function Request(config: ReuqestConfig) {
    return function (service: any, funName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) {
        descriptor.value = refactorMethod(descriptor.value, config);
        descriptor.writable = false
    }
}