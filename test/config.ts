import { serviceConfig } from '../src/index';

serviceConfig({
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