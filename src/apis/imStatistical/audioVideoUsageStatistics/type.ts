
export interface LastDayVideoCountType {
  totalVideoTime: number
  chatVideoTime: number
  groupVideoTime: number
  totalAudioTime: number
  chatAudioTime: number
  groupAudioTime: number
}

/**查询统计数据 接收参数*/
export interface imAudioVideoCountParamsType {
  startTime: string
  endTime: string
}

/**查询统计数据 返回参数*/
export interface imAudioVideoCountType {
  id: string;
  chatVideoTime: number;
  groupVideoTime: number;
  chatAudioTime: number;
  groupAudioTime: number;
  date: string;
  startTime?: any;
  endTime?: any;
}
