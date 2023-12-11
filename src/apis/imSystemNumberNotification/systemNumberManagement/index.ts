import { http } from '@/utils/alova/index'
import { ImSystemNumber } from './type'

/**获取系统号分页*/
export const getSystemNumberPage = (query: Partial<ImSystemNumber>) => http.postRequest<PagesType<ImSystemNumber[]>>('/imSystemNumber/page', query)

/**系统号保存*/
export const save = (query: ImSystemNumber) => http.postRequest('/imSystemNumber/save', query)
