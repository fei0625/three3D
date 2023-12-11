export interface GroupManagementPageListType {
  id: string
  groupId: string
  userId: number
  name: string
  notice: string
  noticeCreateTime: string
  everyoneMute: boolean
  verify: number
  watchGroupMembers: boolean
  addGroupMembers: boolean
  icon: string
  number: number
  sensitiveStatus: number
  address: string
  userName: string
}

export interface GroupManagementChangeStatus {
  id: string
  groupId: string
  sensitiveStatus: number
}

export interface GroupManagementQuery {
  groupId: string
  name: string
  userName: string
}

export interface GroupManageUserPage {
  userId: number
  userName: string
  phoneName: number
  email: number
}

export interface ImUserGroupAuthorisationPage {
  id: number
  staffId: number
  staffCode: string
  status: number
  groupId: string
  userId: string
  applyProve: string
  applyRemark: string
  reason: string
  applyDuration: number
  createTime: string
  authorizationStartTime: string
  authorizationEndTime: string
}

export interface ImUserGroupAuthorisation {
  id: number
  status: number
  userId: string
  applyProve: string
  applyRemark: string
  reason: string
  applyDuration: number
  groupName: string
}

export interface ImGroupViolationsLogList {
  violationsType: number
  processing: number
  groupId: string
  name: string
  postpone: string
  remark: string
  banRemark: string
  createTime: string
}

export interface ImViolationsTypeLogList {
  id: string
  name: string
  status: number
  createTime: string
  count: number
  triggerCount: number
}

export interface StaffType {
  password: string
}

export interface ImUserGroupAuthorisation {
  id: number
  groupId: string
}

export interface ImGroupMessagePage {
  msgId: string
  groupId: string
  content: string
  formUserId: number
  localDate: string
  imMessageType: string
}
