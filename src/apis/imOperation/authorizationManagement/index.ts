import { http } from '@/utils/alova/index'
import { ImApplyPageListType, StaffType } from './type'

/**
 * 获取申请授权列表
 * @param imApplyPageListType
 * @returns
 */
export const getImApplyPageList = (imApplyPageListType: Partial<ImApplyPageListType>) =>
  http.postRequest<PagesType<ImApplyPageListType[]>>('/im/authorizationManagement/page', imApplyPageListType)

export const getImApplyPass = (imApplyPageListType: Partial<ImApplyPageListType>) =>
  http.postRequest<PagesType<boolean>>('/im/authorizationManagement/updateById', imApplyPageListType)

export const getPasswordStaff = (staffType: Partial<StaffType>) => http.postRequest<PagesType<boolean>>('/im/authorizationManagement/staffPassword', staffType)
