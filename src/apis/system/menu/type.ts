export interface MenuType {
  menuId: number
  parentMenuId: number | null
  title: string
  menuDesc: string
  path: string
  sort: number | null
  menuType: string
  icon: string | null
  hideMenu: string
  createTime: string
  createBy: number
  updateTime: string
  updateBy: number
  component: string | null
  frameSrc: string | null
  children: MenuType[] | null
  inMenuIdList: number[] | null
  type: number
  id: number | null
  pid: number
}
export interface MenuSaveType {
  menuId: number
  type: number
  menuType: string
  parentMenuId: number
  title: string
  icon: string
  sort: number
  path: string
  component: string
  frameSrc: string
  hideMenu: string
  menuDesc: string
}
