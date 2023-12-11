export interface LastDayGroupCountType {
  activeGroupCount: number
  silentGroupCount: number
  newGroupCount: number
  dissolveGroupCount: number
}


/**查询统计数据 接收参数*/
export interface imGroupCountParamsType {
  startTime: string
  endTime: string
  queryType: number[]
}

/**查询统计数据 返回参数*/
export interface imGroupCountType {
  date: string[]
  imUserCountYVos: ImGroupCountYVoType[]
}

interface ImGroupCountYVoType {
  name: string
  data: number[]
  key: string
}

