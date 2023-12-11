import { http } from '@/utils/alova'
import { LastDayUserCountType, imUserCountType, imUserCountParamsType } from './type'

/**查询昨日数据*/
export const getLastDayUserCount = () => http.postRequest<LastDayUserCountType>('/summary/getLastDayUserCount')

/**查询统计数据*/
export const imUserCount = (data: imUserCountParamsType) => http.postRequest<imUserCountType>('/summary/imUserCount', data)
