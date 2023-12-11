import type { EchartsDataType } from '../components/index'

import { getI18nValue } from '@/utils/i18n'

export interface CarListType {
  name: string
  description: string
  sum: string | number
  sizeColor: string
}

//  选中的被除数类型
export type DividendSelectedType = 'sendSuccessCount' | 'sendFailCount' | 'sendClickCount'

// 选中的除数类型
export type DivisorSelectedType = DividendSelectedType | 'sendTotalCount'

// 被除数
export const dividendOptions = [
  {
    value: 'sendSuccessCount',
    label: getI18nValue('successRateStatisticsMsg.sendSuccessCount') //推送成功总量
  },
  {
    value: 'sendFailCount',
    label: getI18nValue('successRateStatisticsMsg.sendFailCount') //推送失败总量
  },
  // {
  //   value: '2',
  //   label: getI18nValue('successRateStatisticsMsg.amountReachedTotal')
  // },
  {
    value: 'sendClickCount',
    label: getI18nValue('successRateStatisticsMsg.sendClickCount') //推送点击总量
  }
]

// 除数
export const divisorOptions = [
  ...dividendOptions,
  {
    value: 'sendTotalCount',
    label: getI18nValue('successRateStatisticsMsg.sendTotalCount') //推送总量
  }
]

//echarts 数据
export const echartsInfo: EchartsDataType = {
  title: getI18nValue('successRateStatisticsMsg.PushOverviewDiagram'),
  xAxisData: [],
  seriesData: [
    {
      name: getI18nValue('successRateStatisticsMsg.dailyPushClicks'),
      type: 'bar',
      data: []
    },

    {
      name: getI18nValue('successRateStatisticsMsg.successfulDailyPushVolume'),
      type: 'bar',
      data: []
    },
    {
      name: getI18nValue('successRateStatisticsMsg.failedDailyPushVolume'),
      type: 'bar',
      data: []
    },
    {
      name: getI18nValue('successRateStatisticsMsg.dailyPushVolume'),
      type: 'bar',
      data: []
    }
  ]
}
