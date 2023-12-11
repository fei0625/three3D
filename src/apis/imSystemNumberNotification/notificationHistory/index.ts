import { http } from '@/utils/alova/index'
import { NotificationHistory } from './type'

/**获取通知历史分页*/
export const getNotificationHistoryPage = (query: Partial<NotificationHistory>) =>
  http.postRequest<PagesType<NotificationHistory[]>>('/imNotificationHistory/page', query)

/**推送*/
export const pushNotification = (query: NotificationHistory) => http.postRequest<NotificationHistory>('/imNotificationHistory/push', query)

/**测回*/
export const revokeNotification = (query: NotificationHistory) => http.postRequest<NotificationHistory>('/imNotificationHistory/revoke', query)

/**系统号列表*/
export const getSystemNumberList = () => http.postRequest('/imNotificationHistory/getSystemNumberList')

/**用户组*/
export const userGroupTree = () => http.postRequest('/imNotificationHistory/userGroupTree')
