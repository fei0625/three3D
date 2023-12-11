import type { LastDayPushImCountType, PushImCountParamsType, PushImCountType } from './type'

import { http } from '@/utils/alova'

/**推送昨日数据统计*/
export const getLastDayPushImCountCount = () => http.postRequest<LastDayPushImCountType>('/summary/getLastDayPushImCountCount')

/** 推送统计*/
export const pushImCount = (data: PushImCountParamsType) => http.postRequest<PushImCountType[]>('/summary/pushImCount', data)
