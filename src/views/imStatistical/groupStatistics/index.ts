import { getI18nValue } from '@/utils/i18n'

export interface CarListType {
  imgUrl: string
  name: string
  description: string
  sum: number | string
  sizeColor: string
  id: number
}
/**群组名称 */
export const groupsMap = {
  1: getI18nValue('groupStatistics.activeGroups'),
  2: getI18nValue('groupStatistics.silentGroups'),
  3: getI18nValue('groupStatistics.newGroupsAdded'),
  4: getI18nValue('groupStatistics.disbandedGroups')
}
/**群组颜色 */
export const groupsColorMap = {
  1: '#209986',
  2: '#566A96',
  3: '#6872FF',
  4: '#FC660C'
}

export type GroupsMapType = keyof typeof groupsMap
export type GroupsColorMapType = keyof typeof groupsColorMap
