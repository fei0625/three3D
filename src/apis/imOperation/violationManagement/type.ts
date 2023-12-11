export interface ImUserPageListType {
  userId: number
  name: string
  phone: string
  email: string
  sensitiveStatus: number
  blockedStatus: boolean
  createTime: string
}

export interface ImGroupPageListType {
  groupId: string
  name: string
  sensitiveStatus: number
  blockedStatus: boolean
}

export interface ImViolationsTypeLogList {
  id: string
  name: string
  status: number
  createTime: string
  count: number
  triggerCount: number
  userId: number
  groupId: string
}

export interface GroupManagementChangeStatus {
  id: string
  groupId: string
  sensitiveStatus: number
}

export interface UserInfoStatusType {
  id: string
  userId: number
  sensitiveStatus: number
}
