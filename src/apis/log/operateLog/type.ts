export interface OperatLogType {
  id: number
  staffId: number
  staffName: string
  actionType: number
  sysMenuId: number
  sysMenuName: string
  menuUrl: string
  requestParam: string
  ip: string
  exception: string
  createTime: string
  startTime?: any
  endTime?: any
}

export interface OperatLogQuery {
  endTime: string
  staffId: string
  startTime: string
}
