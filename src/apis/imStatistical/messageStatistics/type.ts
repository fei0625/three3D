interface LastDayMessageImCountType {
  sendMessageCount: number
  sendAvagMessageCount: number
  groupSendMessageCount: number
  groupSendAvagMessageCount: number
  sysSendMessageCount: number
  sysUserSendMessageCount: number
  sysSendMessagePushCount: number
}

interface ImUserCountYVoType {
  name: string
  data: number[]
  key: string
}

/**查询统计数据 返回参数*/
interface imUserCountType {
  date: string[]
  imUserCountYVos: ImUserCountYVoType[]
}

/**查询统计数据 接收参数*/
interface imUserCountParamsType {
  startTime: string
  endTime: string
  queryType: number[]
  isSystem: boolean
}

export type { LastDayMessageImCountType, imUserCountType, imUserCountParamsType, ImUserCountYVoType }
