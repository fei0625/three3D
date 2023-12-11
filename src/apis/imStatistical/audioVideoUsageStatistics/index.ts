import { http } from '@/utils/alova'
import { imAudioVideoCountParamsType, imAudioVideoCountType, LastDayVideoCountType } from './type'

/**查询昨日数据*/
export const getLastDayImVideoCountCount = () => http.postRequest<LastDayVideoCountType>('/summary/getLastDayImVideoCountCount')

/**查询统计数据*/
export const ImVideoCount = (data: imAudioVideoCountParamsType) => http.postRequest<imAudioVideoCountType []>('/summary/ImVideoCount', data)
