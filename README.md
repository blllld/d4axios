# how to use `d4axios` in your project ?

[中文说明](./README_zh.md)
[demo](./test/demo.ts)

> step 1 : `configuration` ，step 2: make a `service` , step 3 : `Use`

## as we know in vue or react , we use `axios` to send  request service such as :

```js
// in vue
export default {
    created(){
        this.$axios.get("/url",{
            params:{ some:"value" }
        })
    }
}
```
more and more code in `.vue` and makes business becoming complex，it cause repetition rate of code becoming higher。It is correctly to find a useful code organization group to make the code easy to maintain

## now，you can use a type likes spring-mvc 

### 1. configuration
at default ,use `axios` as request method; and support `axios` configuration;
and nor need regist axios any more;

now in your `main.ts` or `main.js`, regist `serviceConfig`
#### for `vue3.x`
```ts
// main.ts
import { createService }  from 'd4axios';
import { createApp } from 'vue'


const app = createApp();

app.use(createService());

```
### for normal
```ts
// configuration.ts
import { serviceConfig }  from 'd4axios';
import Axios from 'axios'

// or use Service provide 
serviceConfig();

// config your setting axios 
// there provide some simple config，
// if you needs more  ，please config in axios and provide it instance
serviceConfig({ 
    axios:Axios,
    // also prodive axiosInstance.interceptors config
    interceptors: {
        request{ use(AxiosRequestConfig){},reject(err){}},
        response:{ use(AxiosResponse){},reject(err){}}
    },
    // or use simle interceptors
    beforeRequest(requestArgs){},
    beforeResponse(AxiosResponse['data']){}
});
```

### 2. create a service
```ts
// create a serivce module
import { Service,  Get, Post, Headers }  from 'd4axios';

@Service("MyService")
export default class MyService  { }
```

#### 2.1 Get
```ts
import { Service,  Get, SendParam }  from 'd4axios';

@Service("MyService")
export default class MyService  { 

    // as default use set headers
    @Get("/getname")
    getName(@SendParam("id") id:string){}

    // restful ,if it has not @SendParam must as args queue to replace 
    @Get("/getname/:id")
    getNameRestful(id:string){ }

    // mixin restful and params
    @Get("/getname/:id")
    getNameMixin(id:string, @SendParam("age") age:number){ }

}
```

#### 2.2 Post the same as Get 

```ts
import { Service,  Get, Post,SendParam }  from 'd4axios';

@Service("MyService")
export default class MyService  { 

    @Get("/getname/:id")
    getNameRestful(id:string){ }
    
    // can use defined method as a service
    // but you should return a named object
    @Post("/update/:id")
    async updateInfo(id:string ){
        let data = await this.getNameRestful(id);
        let userName = data;
        if(userName == null){
            userName = "generate";
        }
        return { id, userName }
    }
}
```

### 3. in `Use` another service;

```ts
// some.service.ts
import {Get ,Service,RequestPrefix,Get} from 'd4axios';

@Service('SomeService')
@RequestPrefix("/goods")
export default class SomeService {
    @Get("/info")
    getGoodsInfo(@SendParam("id") id:string){ }
}

```
next use `some.service` in `my.service`

```ts
// my.service.ts
import {Get ,Service,RequestPrefix, Get} from 'd4axios';
import SomeService from './some.service'

@Service('MyService')
@RequestPrefix("/me")
export default class MyService {

    @Use(SomeService) 
    someService!:S<SomeService>

    @Get("/goods/info")
    getGoodsInfo(@SendParam("id") id:string){ 
        return this.someService.getGoodsInfo(id)
    }
}

```

### 4. use service in vue

#### 4.1 in `Use`

```ts
// in vue-ts  use

import { Use } from 'd4axios';
import MyService from './MyService.service'

@Component()
export default class MyComponent {

    @Use(MyService) 
    myService!:S<MyService>
    
    async created(){
        let data = await this.myService.getName(10086);
    }
}
```

#### 4.2 in `VueServiceBind`

```ts
// or muti bind

import { VueServiceBind } from 'd4axios';
import MyService from './MyService.service'
import OtherService from './OtherService.service'

@VueServiceBind(MyService,OtherService)
@Component()
export default class MyComponent {
    
    myService!:S<MyService>
    
    otherService !: S<OtherService>

    async created(){
        let data = await this.myService.getName(10086);
    }
}
```

#### 4.3 in `mapService`

```ts
// in normal 

import { mapService } from 'd4axios';
import MyService from './MyService.service'

export default {
    computed:{
        ...mapService(MyService,OtherService)
    },
    created(){
        this.myService.getName(10086);
    }
}
```


## in your project root create  `d4axios.d.ts` and declare to cover `ResponseDataType<T>`
```TS
// index.d.ts
declare interface ResponseDataType<T>  {
    // your response type
}
```