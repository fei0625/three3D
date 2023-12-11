export interface QuartzJobType {
  jobId: number
  extendType: number
  extendId: number
  jobName: string
  jobGroup: string
  invokeTarget: string
  cronExpression: string
  misfirePolicy: string
  concurrent: string
  status: string
  createModel: string
  createBy: number
  createTime: string
  updateBy: number
  updateTime: string
  remark: string | null
  isDelete: string
}
export interface QuartzJobQueryType {
  jobName: string
  createModel: string
  status: string
}

export interface QuartzJobSaveType {
  jobId: number
  jobName: string
  jobGroup: string
  invokeTarget: string
  cronExpression: string
  misfirePolicy: number
  concurrent: number
  status: number
  remark: string
}

export interface QuartJobLogType {
  jobLogId: number
  jobName: string
  jobId: number
  jobGroup: string
  invokeTarget: string
  jobMessage: string
  status: string
  exceptionInfo?: any
  createTime: string
}

export interface QuartJobLogQueryType {
  jobId: number
  status: string
}
