type ErrorType = { code: number, name: string, msg: string }


export const ERROR = {
    Init: {
        code: 100,
        name: "ServiceInitError",
        msg: 'Please use `ServiceConfig` to initialize the service before use'
    },
    Empty: {
        code: 1001,
        name: "ServiceInjectEmpty",
        msg: 'Inject at least one Service'
    },
    NoService: (name) => {
        return {
            code: 1002,
            name: "ServiceTypeError",
            msg: `Service loss decorator @Service(${name})`
        }
    },
    ArgsError: (url, type) => {
        return {
            code: 2001,
            name: "ArgsError",
            msg: ` ${url} of method result only support in object，Map，FormData Got ${type}`
        }
    },
    RestfulError: (url, length: number,callargs:number = 0) => {
        return {
            code: 2002,
            name: "RestfulReplaceError",
            msg: `${url} restful matched ${length} params but only replace ${callargs} size`
        }
    }
}



export default class ServiceError extends Error {
    message: string;
    name: string;
    constructor(error: ErrorType) {
        super();
        this.name = error.name
        this.message = `[d4axios] code: ${error.code},Cause [${error.msg}]`
    }
}