import { http } from '@/utils/alova/index'
import { LoginLogPageListType } from './type'
import { StaffType } from '@/apis/basic/staff/type'

/**获取LoginLog列表*/
export const getLoginLogPageList = (loginLogPageListQuery: Partial<LoginLogPageListType>) =>
  http.postRequest<PagesType<LoginLogPageListType[]>>('/log/loginLog/list', loginLogPageListQuery)

/**loginLog员工列表*/
export const getStaffList = (loginLogStaffListQuery: StaffType) => http.postRequest<StaffType>('/log/loginLog/staffList', loginLogStaffListQuery)
