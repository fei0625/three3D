import { http } from '@/utils/alova/index'
import { VueMenuType, SystemConfigType } from './type'

/**获取动态路由*/
export const getVueMenu = () => http.postRequest<VueMenuType[]>('/index/vueMenu')

/**获取动态权限 */
export const getFlushVueAuth = () => http.postRequest<{ userMenu: Record<string, string> }>('/index/flushVueAuth')

/**获取系统配置 */
export const getSystemConfig = () => http.postRequest<SystemConfigType>('/login/UploadImage')

/**解锁 */
export const unlock = (params: string) => http.postRequest('/index/judgePassword', params)

/**修改密码 */
export const editPassword = (params: { staffCode: string; password: string; originalPassword: string }) => http.postRequest('login/updateById', params)
/**图片上传 */
export const uploadImage = (params: FormData) => http.postRequest('/upload/img', params)
