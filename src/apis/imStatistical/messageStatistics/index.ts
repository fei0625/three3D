import type { LastDayMessageImCountType, imUserCountType, imUserCountParamsType } from './type'
import { http } from '@/utils/alova'

/**消息昨日数据统计*/
export const getLastDayMessageCount = () => http.postRequest<LastDayMessageImCountType>('/summary/getLastDayMessageCount')

/**消息昨日数据统计*/
export const imMessageCount = (data: imUserCountParamsType) => http.postRequest<imUserCountType>('/summary/imMessageCount', data)
