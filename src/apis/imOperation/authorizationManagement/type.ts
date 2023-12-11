export interface ImApplyPageListType {
  id: string
  staffId: number
  staffCode: string
  status: number
  applyProve: string
  applyRemark: string
  groupId: string
  reason: string
  applyDuration: number
  createTime: string
  authorizationStartTime: string
  authorizationEndTime: string
}

export interface StaffType {
  password: string
}
