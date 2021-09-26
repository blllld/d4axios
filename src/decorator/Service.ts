/**
 * 服务绑定
 * @param name 当前服务名称
 * @param camelCase 是否采用驼峰表达法
 * @returns 
 */
export default function Serivce(name: string, camelCase: boolean = true) {
    return function (Service: any) {
        if (camelCase) {
            // 将名称转为驼峰标识，按照下划线断开
            name = name
                .split("_")
                .map((item, index) => item.replace(/^([a-zA-Z])/, i => index ? i.toUpperCase() : i.toLowerCase()))
                .join("")
        }
        Service.__name = name;
    }
}