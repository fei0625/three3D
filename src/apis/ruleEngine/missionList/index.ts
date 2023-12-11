import { http } from '@/utils/alova/index'
import { QuartzJobType, QuartzJobQueryType, QuartzJobSaveType, QuartJobLogType, QuartJobLogQueryType } from './type'

/**获取QuartzJob列表*/
export const getQuartzJobPageList = (quartzJobQuery: Partial<QuartzJobQueryType>) =>
  http.postRequest<PagesType<QuartzJobType[]>>('/rule/quartz-job/page', quartzJobQuery)

/**quartzJob保存*/
export const quartzJobSave = (quartzJobSave: QuartzJobSaveType) => http.postRequest('/rule/quartz-job/save', quartzJobSave)

/**quartzJob删除*/
export const quartzJobDel = (jobId: number) => http.postRequest('/rule/quartz-job/removeById', jobId)

/** quartzJob立即执行 */
export const quartzJobPerform = (jobId: number) => http.postRequest('/rule/quartz-job/run', jobId)

/** 任务日志 */
export const getQuartzJobLogPageList = (quartzJobLogQuery: Partial<QuartJobLogQueryType>) =>
  http.postRequest<PagesType<QuartJobLogType[]>>('/rule/quartz-job/logPage', quartzJobLogQuery)

/** 状态修改 */
export const quartzJobChangeStatus = (quartzJobStatusSave: { jobId: number; status: string }) =>
  http.postRequest('/rule/quartz-job/changeStatus', quartzJobStatusSave)
