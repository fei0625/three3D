import { http } from '@/utils/alova/index'
import { SystemConfigType } from '@/apis/common/type'

/**获取systemConfiguration 配置*/
export const getsSystemConfiguration = () =>
  http.postRequest<SystemConfigType>('/sys/systemConfiguration/getById', {
    systemId: 1
  })

/**systemConfiguration保存*/
export const systemConfigurationSave = (systemConfigSave: SystemConfigType) => http.postRequest('/sys/systemConfiguration/updateById', systemConfigSave)
