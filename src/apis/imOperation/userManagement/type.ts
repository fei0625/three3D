export interface UserInfoPageListType {
  id: string
  userId: number
  name: string
  phone: string
  email: string
  icon: string
  status: number
  online: number
  address: string
  sensitiveStatus: number
  createTime: string
}

export interface UserInfoStatusType {
  id: string
  userId: number
  sensitiveStatus: number
}

export interface UserInfoPasswordType {
  id: string
  userId: number
  password: string
}

export interface ImUserViolationsLogList {
  violationsType: number
  processing: number
  userId: string
  userName: string
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
  id: string
  userId: string
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

export interface ImUserMessagePage {
  msgId: string
  content: string
  formUserId: number
  toUserId: number
  localDate: string
  imMessageType: string
}
