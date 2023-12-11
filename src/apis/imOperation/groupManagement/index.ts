import { http } from '@/utils/alova/index'
import {
  StaffType,
  ImUserGroupAuthorisation,
  ImViolationsTypeLogList,
  GroupManagementPageListType,
  GroupManageUserPage,
  GroupManagementChangeStatus,
  ImUserGroupAuthorisationPage,
  ImGroupViolationsLogList,
  ImGroupMessagePage
} from './type'

/**获取群组列表*/
export const getGroupManagementPageList = (groupManagementPageListType: Partial<GroupManagementPageListType>) =>
  http.postRequest<PagesType<GroupManagementPageListType[]>>('/im/groupManagement/page', groupManagementPageListType)

/**修改状态 */
export const getchangeStatus = (groupManagementChangeStatus: Partial<GroupManagementChangeStatus>) =>
  http.postRequest<boolean>('/im/groupManagement/changeStatus', groupManagementChangeStatus)

/** 组列表 */
export const getUserList = (groupManageUserPage: Partial<GroupManageUserPage>) =>
  http.postRequest<PagesType<GroupManageUserPage[]>>('/im/groupManagement/userList', groupManageUserPage)

/** 申请列表 */
export const getApplyPage = (imApplyPage: Partial<ImUserGroupAuthorisationPage>) =>
  http.postRequest<PagesType<ImUserGroupAuthorisationPage[]>>('/im/groupManagement/applyPage', imApplyPage)

/** 申请保存 */
export const getApplySave = (imApplyPage: Partial<ImUserGroupAuthorisationPage>) =>
  http.postRequest<PagesType<boolean>>('/im/groupManagement/applySave', imApplyPage)

/**
 * 违规保存
 */
export const getGroupViolationsSave = (imGroupViolationsLogList: Partial<ImGroupViolationsLogList>) =>
  http.postRequest<PagesType<boolean>>('/im/groupManagement/groupViolationsSave', imGroupViolationsLogList)

/**
 * 词类别
 */
export const getImViolationTypeList = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<ImViolationsTypeLogList>>('/im/groupManagement/imViolationTypeList', imViolationsTypeLogList)

/**
 * 员工密码
 */
export const getPasswordStaff = (staffType: Partial<StaffType>) => http.postRequest<PagesType<boolean>>('/im/groupManagement/staffPassword', staffType)

/**
 * 授权码
 */
export const getAuthorizationCode = (imUserGroupAuthorisation: Partial<ImUserGroupAuthorisation>) =>
  http.postRequest<PagesType<boolean>>('/im/groupManagement/authorizationCode', imUserGroupAuthorisation)

/**
 * 群组历史消息
 */
export const getGroupMessageList = (imGroupMessagePage: Partial<ImGroupMessagePage>) =>
  http.postRequest<PagesType<ImGroupMessagePage[]>>('/im/groupManagement/groupMessagePage', imGroupMessagePage)
