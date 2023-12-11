import { http } from '@/utils/alova'
import { LastDayGroupCountType, imGroupCountType, imGroupCountParamsType } from './type'

/**查询昨日数据*/
export const getLastDayGroupCount = () => http.postRequest<LastDayGroupCountType>('/summary/getLastDayGroupCount')

/**查询统计数据*/
export const imGroupCount = (data: imGroupCountParamsType) => http.postRequest<imGroupCountType>('/summary/imGroupCount', data)
