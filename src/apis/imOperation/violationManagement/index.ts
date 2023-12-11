import { http } from '@/utils/alova/index'
import { ImGroupPageListType, ImUserPageListType, ImViolationsTypeLogList, GroupManagementChangeStatus, UserInfoStatusType } from './type'

/**违规用户列表*/
export const getUserPageList = (imUserPageListType: Partial<ImUserPageListType>) =>
  http.postRequest<PagesType<ImUserPageListType[]>>('/im/violationManagement/userPage', imUserPageListType)

/**违规组列表*/
export const getGroupPageList = (imGroupPageListType: Partial<ImGroupPageListType>) =>
  http.postRequest<PagesType<ImGroupPageListType[]>>('/im/violationManagement/groupPage', imGroupPageListType)

/** 用户违规列表 */
export const getUserImViolationTypeList = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<ImViolationsTypeLogList>>('/im/violationManagement/userImViolationTypeList', imViolationsTypeLogList)

/** 群组违规列表 */
export const getGroupImViolationTypeList = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<ImViolationsTypeLogList>>('/im/violationManagement/groupImViolationTypeList', imViolationsTypeLogList)

/** 用户延期 */
export const getUserUpdateById = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<boolean>>('/im/violationManagement/userUpdateById', imViolationsTypeLogList)

/** 用户解除禁言/封号 */
export const getUserRelieveUpdateById = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<boolean>>('/im/violationManagement/userRelieveUpdateById', imViolationsTypeLogList)

/** 群组延期 */
export const getGroupUpdateById = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<boolean>>('/im/violationManagement/groupUpdateById', imViolationsTypeLogList)

/** 群组解除禁言/封号 */
export const getGroupRelieveUpdateById = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<boolean>>('/im/violationManagement/groupRelieveUpdateById', imViolationsTypeLogList)

/** 群组敏感状态 */
export const getGroupChangeStatus = (groupManagementChangeStatus: Partial<GroupManagementChangeStatus>) =>
  http.postRequest<PagesType<boolean>>('/im/violationManagement/groupChangeStatus', groupManagementChangeStatus)

/** 用户敏感状态 */
export const getUserChangeStatus = (userInfoStatusType: Partial<UserInfoStatusType>) =>
  http.postRequest<PagesType<boolean>>('/im/violationManagement/userChangeStatus', userInfoStatusType)
