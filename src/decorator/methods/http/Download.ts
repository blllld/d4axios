import { AxiosResponse } from 'axios';
import Request from '../../../service/Request'
import { getAxios } from '../../../ServiceConfig'

/**
 * 下载标记
 * @param url 
 * @param fileName 如果后台没有提供文件名，则必须手动指定
 * @param mime 文件类型，默认不需要，可以手动设置为指定的 MiME type
 * @param immediate 立即下载
 * @returns 如果立即下载，则会使用download属性进行下载
 */
export default async function Download(url: string, fileName?: string | (() => string), mime?: string, immediate?: boolean) {
    let response = await <AxiosResponse<Blob>>Request({
        url,
        method: "POST",
        fullReturn: immediate,
        doRequest: (fullURL, body, headers) => {
            return (getAxios().$post || getAxios().post)(fullURL, body, {
                headers,
                responseType: "blob"
            });
        }
    });
    if (immediate) {
        if (!fileName) {
            fileName = response.headers['content-disposition'].split('filename=')[1];
        }
        if (typeof fileName != 'string') {
            fileName = fileName();
        }
        const blob = new Blob([response.data], { type: mime });
        const downloadEL = document.createElement('a');
        var href = window.URL.createObjectURL(blob);
        downloadEL.href = href;
        downloadEL.download = decodeURIComponent(fileName);
        document.body.appendChild(downloadEL);
        downloadEL.click();
        document.body.removeChild(downloadEL);
        window.URL.revokeObjectURL(href);
    }
    return response;
}