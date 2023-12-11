import { http } from '@/utils/alova/index'
import {
  ImUserGroupAuthorisation,
  StaffType,
  UserInfoPageListType,
  UserInfoStatusType,
  UserInfoPasswordType,
  ImUserViolationsLogList,
  ImViolationsTypeLogList,
  ImUserGroupAuthorisationPage,
  ImUserMessagePage
} from './type'

/**获取用户列表*/
export const getUserInfoPageList = (userInfoPageListType: Partial<UserInfoPageListType>) =>
  http.postRequest<PagesType<UserInfoPageListType[]>>('/im/userManagement/page', userInfoPageListType)

/**修改状态 */
export const getChangeStatus = (userInfoStatusType: Partial<UserInfoStatusType>) =>
  http.postRequest<boolean>('/im/userManagement/changeStatus', userInfoStatusType)

/**修改密码 */
export const getUserInfoPassword = (userInfoPasswordType: Partial<UserInfoPasswordType>) =>
  http.postRequest<boolean>('/im/userManagement/getUserInfoPassword', userInfoPasswordType)

/**
 * 违规保存
 */
export const getUserViolationsSave = (imUserViolationsLogList: Partial<ImUserViolationsLogList>) =>
  http.postRequest<PagesType<boolean>>('/im/userManagement/userViolationsSave', imUserViolationsLogList)

/** 申请列表 */
export const getApplyPage = (imApplyPage: Partial<ImUserGroupAuthorisationPage>) =>
  http.postRequest<PagesType<ImUserGroupAuthorisationPage[]>>('/im/userManagement/applyPage', imApplyPage)

/** 申请保存 */
export const getApplySave = (imApplyPage: Partial<ImUserGroupAuthorisationPage>) =>
  http.postRequest<PagesType<boolean>>('/im/userManagement/applySave', imApplyPage)

/**
 * 词类别
 */
export const getImViolationTypeList = (imViolationsTypeLogList: Partial<ImViolationsTypeLogList>) =>
  http.postRequest<PagesType<ImViolationsTypeLogList>>('/im/userManagement/imViolationTypeList', imViolationsTypeLogList)

/**
 * 员工密码
 */
export const getPasswordStaff = (staffType: Partial<StaffType>) => http.postRequest<PagesType<boolean>>('/im/userManagement/staffPassword', staffType)

/**
 * 授权码
 */
export const getAuthorizationCode = (imUserGroupAuthorisation: Partial<ImUserGroupAuthorisation>) =>
  http.postRequest<PagesType<boolean>>('/im/userManagement/authorizationCode', imUserGroupAuthorisation)

/**
 * 用户历史消息
 */
export const getUserMessageList = (imUserMessagePage: Partial<ImUserMessagePage>) =>
  http.postRequest<PagesType<ImUserMessagePage[]>>('/im/groupManagement/userMessagePage', imUserMessagePage)
