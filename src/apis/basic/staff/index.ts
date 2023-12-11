import { http } from '@/utils/alova/index'
import { StaffType, StaffSaveType, StaffQueryType } from './type'

/**获取Staff列表*/
export const getStaffPageList = (staffQuery: Partial<StaffQueryType>) => http.postRequest<PagesType<StaffType[]>>('/sys/staff/list', staffQuery)

/**Staff保存*/
export const staffSave = (staffSave: StaffSaveType) => http.postRequest('/sys/staff/save', staffSave)

/**Staff状态修改*/
export const staffChangeStatus = (staffStatusSave: { staffId: number; status: string }) => http.postRequest('/sys/staff/changeStatus', staffStatusSave)

/**Staff删除*/
export const staffDel = (staffDelParams: number) => http.postRequest('/sys/staff/remove', staffDelParams)

/**密码重置 */
export const staffRestPassword = (staffRestPwdParams: { password: string; staffId: number }) =>
  http.postRequest<StaffType[]>('/sys/staff/restPwd', staffRestPwdParams)

/** 邮箱手机号修改 */
export const staffEmailMobileEdit = (staffEmailMobileParams: { staffCode: string; staffId: number; email?: string; mobileNum?: string }) =>
  http.postRequest<StaffType[]>('/sys/staff/emailUpdate', staffEmailMobileParams)
