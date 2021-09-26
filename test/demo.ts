import { Post, SendParam, Service, VueServiceBind, RequestPrefix } from '../src/index';

type a = Partial<{}>
@Service("MyService")
@RequestPrefix("/api")
export default class MyService {

    @Post("/myname")
    setMyname<T>(@SendParam("id") id: string, @SendParam("name") name: string) { }
}

@VueServiceBind(MyService)
class MyComponent {
    myService!: MyService
    async mounted() {
        let data = await this.myService.setMyname("1", "张三")
    }
}

