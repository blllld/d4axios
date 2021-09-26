import Request from '../../../service/Request'
import { getAxios } from '../../../ServiceConfig'
/**
 * post 请求
 * @param url 
 * @returns 
 */
export default function Post(url: string) {
    return Request({
        url,
        method: "POST",
        doRequest: (fullURL, body, headers) => (getAxios().$post || getAxios().post)(fullURL, body, { headers })
    })
}