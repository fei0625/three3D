import type { ImUserCountYVoType } from '@/apis/imStatistical/messageStatistics/type'
import { getI18nValue } from '@/utils/i18n'

export interface CarListType {
  imgUrl: string
  name: string
  description: string
  sum: number | string
  sizeColor: string
  id?: number
}

export interface ParamsType {
  item: ImUserCountYVoType
  platform: PlatformMapType
  msgType: PlatformMsgMapType
}

export interface MessageListType {
  id: number
  name: string
}

export interface MessageOptionsType {
  value: string | number
  label: string
}

export type PlatformMsgMapType = keyof typeof platformMsgMap
export type PlatformMapType = keyof typeof platformMap

/**区分平台 */
export const platformMap = {
  All: '所有平台',
  IOS: 'IOS',
  Android: 'Android',
  PC: 'PC'
}
/**区分消息 */
export const platformMsgMap = {
  singleUplink: '单聊上行消息数',
  perCapitaUplink: '人均上行消息数',
  groupUplink: '群聊上行消息',
  groupAverageUplink: '群聊上行平均消息',
  systemUplink: '系统消息上行消息数',
  systemDistribution: '系统消息分发消息数',
  systemPush: '系统消息push消息数'
}

/**区分不同平台单聊颜色 */
export const platformUserColorMap = {
  All: {
    singleUplink: '#6ed2c9', //单聊上行消息数
    perCapitaUplink: '#fc0202', //人均上行消息数
    groupUplink: '#3d8fff', //群聊上行消息
    groupAverageUplink: '#94d355', //群聊上行平均消息
    systemUplink: '#ff6ce8', //系统消息上行消息数
    systemDistribution: '#d4e7d5', //系统消息分发消息数
    systemPush: '#e30066' //系统消息push消息数
  },
  IOS: {
    singleUplink: '#e54352',
    perCapitaUplink: '#f95800'
  },
  Android: {
    singleUplink: '#0066ff',
    perCapitaUplink: '#353535'
  },
  PC: {
    singleUplink: '#93134d',
    perCapitaUplink: '#321f73'
  }
}

// 公共数据对比（空）
const commonOption = {
  value: 'All',
  label: getI18nValue('userStatisticalMsg.empty')
}

//单聊数据对比
export const uplinkChatOptions = [
  commonOption,
  {
    value: 1,
    label: getI18nValue('messageStatisticsMsg.uplinkSingleChat')
  },
  {
    value: 2,
    label: getI18nValue('messageStatisticsMsg.upstreamMessagesChat')
  }
]

//群聊数据对比
export const groupChatOptions = [
  commonOption,
  {
    value: 3,
    label: getI18nValue('messageStatisticsMsg.groupChatUplinkMessages')
  },
  {
    value: 4,
    label: getI18nValue('messageStatisticsMsg.uplinkMessagesGroupChat')
  }
]

//系统消息数据对比
export const systemMessageOptions = [
  commonOption,
  {
    value: 5,
    label: getI18nValue('messageStatisticsMsg.systemMessageUplinkMessages')
  },
  {
    value: 6,
    label: getI18nValue('messageStatisticsMsg.systemMessageDistributionMessages')
  },
  {
    value: 7,
    label: getI18nValue('messageStatisticsMsg.systemMessagePushMessages')
  }
]

// 消息列表（单聊、群聊、系统消息）
export const messageList = [
  {
    id: 1,
    name: '单聊'
  },
  {
    id: 2,
    name: '群聊'
  },
  {
    id: 3,
    name: '系统消息'
  }
]
