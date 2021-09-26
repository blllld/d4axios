import ServiceMap from '../ServiceMap';

/**
 * 绑定到vue的组件上
 * @param args 服务组件
 * @returns 
 */
export default function VueServiceBind(...args: any[]) {
    return function (VueComponent: any) {
        if (!VueComponent.options.computed) {
            VueComponent.options.computed = {}
        }

        VueComponent.options.computed = {
            ...VueComponent.options.computed,
            ...ServiceMap(...args)
        }
    }
}