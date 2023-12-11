interface LastDayPushImCountType {
  sendTotalCount: number
  sendSuccessCount: number
  sendFailCount: number
  sendClickCount: number
}

interface PushImCountParamsType {
  startTime: string
  endTime: string
}
interface PushImCountType {
  sendClickCount: string //点击总量
  sendFailCount: string //发送失败总量
  sendSuccessCount: string //发送成功总数
  sendTotalCount: string //发送总数
  manufacturer: string //厂商名称
}

interface EchartsBarType {
  xAxisData: string[]
  seriesData: {
    name: string
    type: 'bar'
    data: number[]
  }[]
}

export type { LastDayPushImCountType, PushImCountParamsType, PushImCountType, EchartsBarType }
