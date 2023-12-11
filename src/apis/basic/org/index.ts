import { http } from '@/utils/alova/index'
import { OrgSaveType, OrgType, OrgQueryType } from './type'

/**获取OrgTree*/
export const getOrgTree = (orgQuery: Partial<OrgQueryType>) => http.postRequest<OrgType[]>('/sys/org/tree', orgQuery)

/**org保存*/
export const orgSave = (orgSave: OrgSaveType) => http.postRequest('/sys/org/save', orgSave)

/**org删除*/
export const orgDel = (orgDelParams: number) => http.postRequest('/sys/org/remove', orgDelParams)

/** 状态org修改 */
export const orgChangeStatus = (orgStatusSave: { orgId: number; status: string }) => http.postRequest('/sys/org/changeStatus', orgStatusSave)
