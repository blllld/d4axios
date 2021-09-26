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
    ArgsError: (url,type) => {
        return {
            code: 2001,
            name: "ArgsError",
            msg: ` ${url} of methods result only support in object，Map，FormData Got ${type}`
        }
    },
}



export default class ServiceError extends Error {
    message: string;
    name: string;
    constructor(error: ErrorType) {
        super();
        this.name = error.name
        this.message = `code: ${error.code},Cause [${error.msg}]`
    }
}