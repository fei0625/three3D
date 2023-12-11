import type { ImUserCountYVoType } from '@/apis/imStatistical/userStatistical/type'
export interface CarListType {
  imgUrl: string
  name: string
  description: string
  sum: number | string
  sizeColor: string
  id: number
}

export interface ParamsType {
  item: ImUserCountYVoType
  platform: PlatformMapType
  userType: PlatformUserMapType
}

export type PlatformUserMapType = keyof typeof platformUserMap
export type PlatformMapType = keyof typeof platformMap

/**区分平台 */
export const platformMap = {
  All: '所有平台',
  IOS: 'IOS',
  Android: 'Android',
  PC: 'PC'
}
/**区分用户 */
export const platformUserMap = {
  active: '活跃用户数',
  msg: '发消息用户数',
  addUser: '新增用户数',
  peak: '同时在线峰值',
  silent: '沉默用户'
}

/**区分不同平台用户颜色 */
export const platformUserColorMap = {
  All: {
    active: '#6ed2c9',
    msg: '#6da49e',
    addUser: '#3d8fff',
    peak: '#94d355',
    silent: '#ffdd00'
  },
  IOS: {
    active: '#e54352',
    msg: '#f95800',
    addUser: '#fad16e',
    peak: '#7d1bf6',
    silent: '#e6003a'
  },
  Android: {
    active: '#00d8ff',
    msg: '#353535',
    addUser: '#fb8887',
    peak: '#a69ece',
    silent: '#3b13af'
  },
  PC: {
    active: '#d872a0',
    msg: '#321f73',
    addUser: '#c8f7a4',
    peak: '#d4e7d5',
    silent: '#a5ef00'
  }
}
