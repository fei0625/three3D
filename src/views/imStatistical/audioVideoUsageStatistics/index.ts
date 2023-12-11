import { getI18nValue } from "@/utils/i18n";

/**颜色 */
export const echartsColorMap = {
  chatVideo: '#3D8FFF',
  groupVideo: '#E86BA2',
  chatAudio: '#E54352',
  groupAudio: '#00D8FF',
}

/**国际化*/
export const echartsNameMap = {
  videoUsageDuration: getI18nValue('audioVideoUsageStatisticsMsg.videoUsageDuration'),
  chatVideo: getI18nValue('audioVideoUsageStatisticsMsg.singleChatVideoDuration'),
  groupVideo: getI18nValue('audioVideoUsageStatisticsMsg.groupChatVideoDuration'),
  voiceUsageDuration: getI18nValue('audioVideoUsageStatisticsMsg.voiceUsageDuration'),
  chatAudio: getI18nValue('audioVideoUsageStatisticsMsg.singleChatVoiceDuration'),
  groupAudio: getI18nValue('audioVideoUsageStatisticsMsg.groupChatVoiceDuration'),
}

export interface CarListType {
  totalUsageTitle: string;
  totalUsage: number | string;
  singleChatTitle: string;
  singleChat: number | string;
  groupChatTitle: string;
  groupChat: number | string;
}
