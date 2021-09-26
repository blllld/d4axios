# 如何在你的项目中使用 `d4axios` ?

> 使用方式很简单，只要先配置，然后创建一个服务模块，再然后 使用它

[demo](./test/demo.ts)
## 众所周知 , 我们一般使用 `axios` 发送服务请求，例如:

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
越来越多的业务代码写在 `.vue` 或者 `.jsx` 文件里，而且业务变得更加复杂，这会导致代码的可读性变差，是时候找一个可用性和可读性更高的业务代码组织方式了，分离开让业务专注业务，让视图专注视图

## 现在，你可以像使用 `spring-mvc` 一样的方式去管理业务代码

### 1. 配置项

默认情况下，内置使用 `axios` 作为业务请求方法，并且支持简单的`axios`的配置操作

#### 在 `vue3.x` 下面使用
```ts
// main.ts
import { createService }  from 'd4axios';
import { createApp } from 'vue'


const app = createApp();

app.use(createService());

```
#### 在其他一般情况下
```ts
// configuration.ts
import { serviceConfig }  from 'd4axios';
import Axios from 'axios'

// 使用默认配置
serviceConfig();

// 使用你指定的axios
// 或者需要对axios做简单配置
serviceConfig({ 
    axios:Axios,
    // 支持配置 axios的interceptors
    interceptors: {
        request{ use(AxiosRequestConfig){},reject(err){}},
        response:{ use(AxiosResponse){},reject(err){}}
    },
    // 或者使用输入和输出参数
    beforeRequest(requestArgs){},
    beforeResponse(AxiosResponse['data']){}
});
```

### 2. 创建一个服务
```ts
// 创建服务模块
import { Service,  Get, Post, Headers }  from 'd4axios';

@Service("MyService")
export default class MyService  { }
```

#### 2.1 发起`Get`请求
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

#### 2.2 `Post` 请求和 `Get` 一样

```ts
import { Service,  Get, Post,SendParam }  from 'd4axios';

@Service("MyService")
export default class MyService  { 

    // 使用匿名参数作为路由match
    @Get("/getname/:id")
    getNameRestful(id:string){ }
    
    // 可以像调用方法一样调用其他函数服务
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

### 3. 用 `Use` 引入其他不同服务;

#### 3.1 首先创建一个其他服务 `some.service`
```ts
// some.service.ts
import { Get ,Service,RequestPrefix,Get } from 'd4axios';

@Service('SomeService')
@RequestPrefix("/goods")
export default class SomeService {
    @Get("/info")
    getGoodsInfo(@SendParam("id") id:string){ }
}

```
接下来在 `my.service`中 使用  `some.service` 

```ts
// my.service.ts
import {Get ,Service,RequestPrefix, Get} from 'd4axios';
import SomeService from './some.service'

@Service('MyService')
@RequestPrefix("/me")
export default class MyService {
    // 只要导入进来，并且用Use注入
    // 然后就像调用一般属性一样调用服务了
    @Use(SomeService) 
    someService!:S<SomeService>

    @Get("/goods/info")
    getGoodsInfo(@SendParam("id") id:string){ 
        return this.someService.getGoodsInfo(id)
    }
}

```

### 4. 在`vue`中使用

#### 4.1 直接使用 `Use` 注入即可，就像在服务里注入一样

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

#### 4.2 使用 `VueServiceBind` 在类中做多个绑定

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

#### 4.3 如果不是`class` 形式

##### 在`vue3`下可以使用 `useService`，其他形式可以使用 `mapService`

```ts
// in vue3 

import { useService } from 'd4axios';
import MyService from './MyService.service'

export default {
    setup(){
        const service = useService(MyService);
    }
}
```

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