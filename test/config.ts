import { ServiceConfig } from "../src";


ServiceConfig({
    beforeRequest: (args) => {
        return args
    },
    interceptors: {
        request: {
            use(config) {
                return config;
            }
        }
    }
})