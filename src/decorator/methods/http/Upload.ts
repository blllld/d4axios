import Request from '../../../service/Request'
import { getAxios } from '../../../ServiceConfig'
import { isFormData, transfer2FormData } from '../../../utils'
/**
 * post 请求
 * @param url 
 * @returns 
 */
export default function Post(url: string) {
    return Request({
        url,
        method: "POST",
        doRequest: (fullURL, body, headers) => {
            body = transfer2FormData(body, !isFormData(body));
            return (getAxios().$post || getAxios().post)(fullURL, body, {
                headers: {
                    ...headers,
                    "Content-Type": "multipart/form-data"
                }
            });
        }
    })
}