import type { EchartsBarType } from '@/apis/imStatistical/successRateStatistics/type'

export interface echartsPropsType {
  xAxisData: any
  linesData: any
}

export interface EchartsDataType extends EchartsBarType {
  title: string
}

export interface LinesDataType {
  name: string
  data: number[]
  color: string
}

export interface EchartsType {
  xAxisData: string[]
  linesData: LinesDataType[]
}
