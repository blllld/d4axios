import BaseService from "../service/BaseService";

/**
 * url前缀
 * @param urlprefix 
 * @returns 
 */
export default function RequestPrefix(urlprefix: string) {
    return function (Service: any) {
        Service.__prefix = urlprefix;
    }
}