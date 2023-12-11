import { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { PageEnum } from '@/enums/pageEnum'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { set } from '@/utils/cache'
import { useGlobalStore } from '@/stores/modules/global'
import { i18n } from '@/i18n/index'
import { getFlushVueAuth } from '@/apis/common'
import { useAsyncRouteStore } from '@/stores/modules/asyncRoute'
const LOGIN_PATH = PageEnum.BASE_LOGIN
const whitePathList: string[] = [] //无重定向白名单

export function createRouterGuards(router: Router) {
  const userStore = useUserStore()
  const globalStore = useGlobalStore()
  const asyncRouteStore = useAsyncRouteStore()

  router.beforeEach(async (to, from, next) => {
    if (to.query.token) {
      userStore.loginToken = to.query.token as string
      set(CacheEnumKey.TOKEN_NAME, to.query.token)
      globalStore.global.language = to.query.lang == 'zh-cn' ? 'zh_CN' : 'en_US'
      i18n.global.locale = globalStore.global.language
      const { data: userAuthMap } = await getFlushVueAuth().send()
      asyncRouteStore.authMap = userAuthMap.userMenu
    }
    // 2.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
    if (to.path === LOGIN_PATH) {
      if (userStore.loginToken) return next(from.fullPath)
      userStore.removeUserIonfo()
      return next()
    }
    // 3.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
    if (whitePathList.includes(to.path as string)) return next()

    // 4.判断是否有 Token，没有重定向到 login 页面
    if (!userStore.loginToken) return next({ path: LOGIN_PATH, replace: true })

    next()
  })

  router.onError(error => {
    console.warn('路由错误', error.message)
  })
}
