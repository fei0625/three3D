export interface VueMenuType {
  children?: VueMenuType[] | null
  component: string
  frameSrc: string | null
  hideMenu: string
  icon: string | null
  id: number
  menuDesc: string
  menuId: number
  menuType: 'N' | 'M' | 'C' | 'F'
  parentMenuId: number | null
  path: string
  pid: number
  title: string
  redirect?: string
  activeMenu?: string
}
export interface SystemConfigType {
  systemId: number
  passwordInterval: number
  notificationDuration: number
  passwordExpiration: number
  attempts: number
  lockScreenTime: number
  lockScreenFlag: number
  lock: number
  validityDuration: number
  photoUrl: string
  strategies: number
  loginMode: number
  logDay: number
}
