import { Post, SendParam, Service, RequestPrefix, Use, useService, Header } from '../src/index';

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
    async setMyname(@SendParam("id") id: string, @SendParam("name") name: string) { }

    @Post("/download")
    @Header({ "Content-type": "multipart/form-data" })
    donwload(form: FormData) { }

    async myage() {

        let data = await this.otherService.setMyname<MyResult>("1", "2")
        console.log(data) // ResponseDataType<MyResult>
    }
}


// in vue
(async () => {
    const myservice = useService(MyService)
    let data = await myservice.setMyname("1", "2");
})