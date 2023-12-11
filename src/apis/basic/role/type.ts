export interface RoleType {
  roleId: number
  roleName: string
  sort: number
  dataScope: number
  agentId: number
  isAdmin: string
  roleType: string
  status: string
  createTime: string
  createBy: number | null
  updateTime: string
  updateBy: number
  isDelete: number
  menuIdList: number[] | null
  inRoleList: number[] | null
  notRoleId: number | null
  reportCodes: string | null
}

export interface RoleQueryType {
  status: string
  roleType: string
  roleName: string
}

export interface RoleSaveType {
  roleId: string
  roleName: string
  roleType: string
  isAdmin: string
  menuIdList: number[]
}

export interface RoleChangeStatusType {
  roleId: number
  status: string
}
