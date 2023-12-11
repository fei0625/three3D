import Alova from './Alova'
const { VITE_APP_URL } = getAppEnvConfig()

/**后台管理域名 */
export const http = new Alova(VITE_APP_URL)
