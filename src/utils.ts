import { AxiosInstance } from "axios";

export const noop = (...args: any[]) => { }

export function proxySupport(obj) {
    if (typeof (Proxy) !== 'undefined') {
        return new Proxy(obj, { set() { return true } });
    } else {
        return obj
    }
}

/**
 * 数据类型检测
 * @param val 
 * @returns 
 */
export function dataType(val: any): string {
    var type = typeof val;
    if (val === null) {
        return "null";
    }
    switch (type) {
        case 'object':
            let constructor = val.constructor || { name: "object" };
            return constructor.name.toLowerCase();
        case 'function':
            let str = val.toString();
            let isClass = str.indexOf("class") === 0;
            if (isClass) {
                return 'class'
            } else {
                return 'function'
            }
        default:
            return type;
    }
}

/**
 * 允许的数据类型
 * @param params 
 * @returns 
 */
export function isAllowParam(params: any): boolean {
    if (isObject(params)) {
        return true;
    }
    if (isFormData(params)) {
        return true;
    }
    if (isMap(params)) {
        return true;
    }

    return false;
}

export function isFunction(params): params is Function {
    return typeof (params) === 'function';
}
export function isBasis(params) {
    return dataType(params) === 'string' || dataType(params) === 'number'
}
/**
 * 判断是否是axios实例
 * @param axios 
 * @returns 
 */
export function isAxiosInstance(axios: any): axios is AxiosInstance {
    return axios && typeof (axios.get) === "function"
}
/**
 * 判断是否是一个object对象
 * @param params 入参
 * @returns 
 */
export function isObject(params: any): params is object {
    return dataType(params) === 'object'
}
/**
 * 判断对象是否是一个 formdata
 * @param params 
 * @returns 
 */
export function isFormData(params: any): params is FormData {
    return dataType(params) === 'formdata'
}

/**
 * 判断对象是否是一个 map
 * @param params 
 * @returns 
 */
export function isMap(params: any): params is FormData {
    return dataType(params) === 'map'
}
/**
 * 判断对象是一个数组
 * @param params 
 * @returns 
 */
export function isArray(params: any): params is Array<any> {
    return dataType(params) === 'array'
}
/**
 * 数据格式转换
 * @param params 
 * @returns 
 */
export function transferData(params: any): any {
    // 可以混用
    // Map 和 FormData的 forEach是一样的
    if (isObject(params)) {
        return params;
    } else {
        let obj = {};
        params.forEach((v, k) => {
            obj[k] = v
        })
        return obj;
    }
}
/**
 * 合并替换restful请求参数
 * @param finalArgs 
 * @param args 
 * @returns 
 */
export function urlJoin(...args: string[]) {
    return args
        .join("/")
        .replace(/\/\//g, "/")
}

/**
 * 重置url
 * @param url 
 * @param p restful参数列表
 * @param params 实际参数
 * @returns 
 */
export function urlReplace(url: string, p: string[], params: any): string {
    let isarr = isArray(params);
    params = transferData(params);
    return p.reduce((url, pk, index) => {
        let kystr = pk.substring(1);
        let valuekey = isarr ? index : kystr
        let value = params[valuekey];
        if (!isBasis(value)) {
            value = value.get ? value.get(kystr) : value[kystr]
        }
        return url.replace(pk, value)
    }, url)
}