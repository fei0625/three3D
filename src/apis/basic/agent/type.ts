export interface AgentType {
  agentId: number
  agentCode: string
  agentName: string
  agentType: string
  logo: string
  status: string
  modifyFlag: string
  createTime: string
  createBy: number | null
  updateTime: string
  updateBy: number
  staff: any | null
  roleId: number | null
  instanceOnline: number | null
  instanceOffline: number | null
  productOnline: number | null
  productOffline: number | null
  phone: string | null
  password?: string | null
  email: string | null
  roleAgentIdList: number[] | null
  portalIdList: number[] | null
}
export interface AgentSaveType {
  agentId: number
  logo: string
  agentName: string
  firstName: string
  lastName: string
  staffCode: string
  password: string
  phone: string
  email: string
  roleId: number[]
  agentType: string
  status: string
}

export interface AgentQueryType {
  agentName: string
}
