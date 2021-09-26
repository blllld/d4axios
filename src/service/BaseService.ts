export default class BaseService {
    /**
     * 当前类名称
     */
    name!: string;
    /**
     * 当前模块名称
     */
    __name!: string;

    /**
     * 当前模块url前缀
     */
    __prefix: string = "";
}