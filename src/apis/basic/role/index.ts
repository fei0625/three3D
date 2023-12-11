import { http } from '@/utils/alova/index'
import { RoleType, RoleQueryType, RoleSaveType, RoleChangeStatusType } from './type'
import { MenuType } from '@/apis/system/menu/type'

/**获取Role列表*/
export const getRolePageList = (roleQuery: Partial<RoleQueryType>) => http.postRequest<PagesType<RoleType[]>>('/sys/sys_role/list', roleQuery)

/**role保存*/
export const roleSave = (roleSave: RoleSaveType) => http.postRequest('/sys/sys_role/save', roleSave)

/**role删除*/
export const roleDel = (roleDelParmas: { roleId: number }) => http.postRequest('/sys/sys_role/remove', roleDelParmas)

/**role获取菜单权限*/
export const getRoleTree = () => http.postRequest<MenuType[]>('/sys/sys_role/tree')

/**role改变状态*/
export const roleChangeStatus = (roleStatusSave: RoleChangeStatusType) => http.postRequest('/sys/sys_role/changeStatus', roleStatusSave)

/**role读取菜单权限*/
export const roleCheckMenuId = (roleMenuParmas: { roleId: number }) => http.postRequest<number[]>('/sys/vueRole/checkMenuId', roleMenuParmas)

/** role列表 */
export const getRoleList = () => http.postRequest<RoleType[]>('/sys/agent/role')
