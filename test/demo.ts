import { Post, SendParam, Service, RequestPrefix, Use, useService } from '../src/index';

@Service("Other")
class OtherService {
    @Post("/myname")
    async setMyname(@SendParam("id") id: string, @SendParam("name") name: string) { }
}

type MyResult = { name: string }

@Service("MyService")
@RequestPrefix("/api")
export default class MyService {

    @Use(OtherService)
    otherService: S<OtherService>; // use S<T> mapping type

    @Post("/myname")
    setMyname(@SendParam("id") id: string, @SendParam("name") name: string) { }

    async myage() {

        let data = await this.otherService.setMyname<MyResult>("1", "2")

        console.log(data) // ResponseDataType<MyResult>
    }
}



// in vue

const myservice = useService(MyService)

let data = myservice.setMyname<MyResult>("1", "2");