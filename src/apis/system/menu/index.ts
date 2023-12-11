import { http } from '@/utils/alova/index'
import { MenuSaveType, MenuType } from './type'

/**获取SysMenu列表*/
export const getMenuTree = () => http.postRequest<MenuType[]>('/sys/menu/tree')

/**sysMenu保存*/
export const menuSave = (menuSave: Partial<MenuSaveType>) => http.postRequest('/sys/menu/save', menuSave)

/**sysMenu删除*/
export const menuDel = (menuParams: { menuId: number; type: number }) => http.postRequest('/sys/menu/remove', menuParams)

/**sysMenu上级菜单*/
export const getTreeExceptF = () => http.postRequest('/sys/menu/treeExceptF')
