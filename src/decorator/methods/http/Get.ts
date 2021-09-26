import Request from '../../../service/Request'
import { getAxios } from '../../../ServiceConfig'

/**
 * get 请求
 * @param url 
 * @returns 
 */
export default function Get(url: string) {
    return Request({
        url,
        method: "GET",
        doRequest: (fullURL, params, headers) => (getAxios().$get || getAxios().get)(fullURL, { headers, params })
    })
}