import { http } from '@/utils/alova/index'
import { OperatLogQuery, OperatLogType } from './type'
/**查询接口*/
export const getOperatLogPageList = (operatLogQuery: Partial<OperatLogQuery>) =>
  http.postRequest<PagesType<OperatLogType[]>>('/log/operatLog/list', operatLogQuery)
/**操作员姓名列表*/
export const getOperatLogStaffList = () => http.postRequest('/log/operatLog/staffList')
