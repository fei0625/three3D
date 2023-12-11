export interface StaffType {
  staffId: number
  staffCode: string
  orgId?: number
  agentId: number
  firstName: string
  lastName: string
  password: string
  status: string
  passExpDate: string
  mobileNum: string
  email: string
  isAdmin: string
  isDelete: number
  lastLoginTime?: string
  passwordUpdateTime: string
  createTime: string
  createBy?: number
  updateTime?: string
  updateBy?: number
}

export interface StaffSaveType {
  staffId: number
  staffCode: string
  orgId: number
  firstName: string
  lastName: string
  password: string
  passExpDate: string
  mobileNum: string
  email: string
  roleId: number[]
  status: string
}

export interface StaffQueryType {
  orgId: number
  status: string
  mobileNum: string
}
