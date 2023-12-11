import { http } from '@/utils/alova/index'
import { AgentSaveType, AgentType, AgentQueryType } from './type'

/**获取agent列表*/
export const getAgentPageList = (agentQuery: Partial<AgentQueryType>) => http.postRequest<PagesType<AgentType[]>>('/sys/agent/list', agentQuery)

/**agent保存*/
export const agentSave = (agentSave: AgentSaveType) => http.postRequest('/sys/agent/save', agentSave)

/**agent状态修改*/
export const agentChangeStatus = (agentStatusSave: { agentId: number; status: string }) => http.postRequest('/sys/agent/changeStatus', agentStatusSave)

/** agent信息 */
export const getAgentDetail = (agentId: number) => http.postRequest('/sys/agent/getById', agentId)

/**agent信息修改*/
export const agentUpdateById = (agentUpdate: AgentSaveType) => http.postRequest('/sys/agent/updateById', agentUpdate)
