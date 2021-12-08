import { AxiosResponse } from 'axios';
import Request from '../../../service/Request'
import { getAxios } from '../../../ServiceConfig'

/**
 * 下载标记
 * @param url 
 * @param immediate 立即下载
 * @param fileName 文件名 xxx.jpg
 * @returns 如果立即下载，则会使用download属性进行下载
 */
export default async function Download(url: string, immediate?: boolean, fileName?: string) {
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
        const blob = new Blob([response.data]);
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