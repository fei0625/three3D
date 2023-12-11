import { createAlova } from 'alova'
import GlobalFetch from 'alova/GlobalFetch'
import VueHook from 'alova/vue'
import { useUserStore } from '@/stores/modules/user'
import { useGlobalStore } from '@/stores/modules/global'
import { getI18nValue } from '@/utils/i18n'
import { router } from '@/router'
import { PageEnum } from '@/enums/pageEnum.ts'
const skipErrorHandlerMap = new Map()

export default class Alova {
  private alovaIns
  constructor(baseURL: string) {
    this.alovaIns = createAlova({
      baseURL: baseURL,
      statesHook: VueHook,
      requestAdapter: GlobalFetch(),
      beforeRequest({ config, url, data }) {
        if (config.headers.skipErrorHandler) {
          skipErrorHandlerMap.set(baseURL + url, true)
          delete config.headers.skipErrorHandler
        }
        if (!isType(data, 'FormData')) {
          config.headers['Content-Type'] = 'application/json; charset=utf-8'
        }
        config.headers['token'] = useUserStore().loginToken
        config.headers['lang'] = useGlobalStore().global.language
      },
      responded: {
        onSuccess: async response => {
          const json = await response.json()
          if (response.status !== 200 || json.code != 0) {
            if (skipErrorHandlerMap.has(response.url)) {
              skipErrorHandlerMap.delete(response.url)
            } else {
              checkStatus(json.code, json.msg)
            }
            return Promise.reject(json)
          }
          return json
        },
        onError: () => {
          new useMessage().error({ message: 'ERR_NETWORK' })
        }
      }
    })
  }
  public getRequest<T>(url: string, config?: any) {
    return this.alovaIns.Get<ResponseResult<T>>(url, config)
  }
  public postRequest<T>(url: string, params?: any, config?: any) {
    if (params) {
      if (isType(params, 'Object')) {
        const { page, pageSize, ...obj } = params
        params = {
          data: obj,
          platform: '4',
          version: '1.0',
          page: page ? page : '',
          pageSize: pageSize ? pageSize : ''
        }
      } else if (!isType(params, 'FormData')) {
        params = {
          data: params,
          platform: '4',
          version: '1.0'
        }
      }
    } else {
      params = {
        platform: '4',
        version: '1.0'
      }
    }

    return this.alovaIns.Post<ResponseResult<T>, unknown>(url, params, config)
  }
}
function checkStatus(status: number | string, msg: string) {
  let err = msg
  switch (status) {
    case 2:
    case 404:
      useUserStore().removeUserIonfo()
      router.push(PageEnum.BASE_LOGIN)

      // err = getI18nValue('errCode.403')
      break
    case 403:
      err = getI18nValue('errCode.403')
      break
    case 500:
      err = getI18nValue('errCode.500')
      break
  }
  new useMessage().error({ message: err })
}
