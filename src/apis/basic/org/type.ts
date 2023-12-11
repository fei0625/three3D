export interface OrgType {
  agentId: number
  children: OrgType[] | null
  createBy: number
  createTime: string
  eqOrgCode: string | null
  eqOrgName: string | null
  id: number
  levelValue: number
  name: string
  notId: number | null
  orgCode: string
  orgId: number
  orgName: string
  orgPath: string | null
  parentOrgId: number | null
  pid: number | null
  regionId: null
  status: string
  updateBy: number | null
  updateTime: string | null
}

export interface OrgSaveType {
  orgId: number
  parentOrgId: number
  orgCode: string
  orgName: string
}

export interface OrgQueryType {
  orgName: string
}
