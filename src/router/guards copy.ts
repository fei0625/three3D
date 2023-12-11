import type { RouteRecordRaw } from 'vue-router'
import { Router } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useAsyncRouteStore } from '@/stores/modules/asyncRoute'
import { PageEnum } from '@/enums/pageEnum'
import { AppRouteRecordRaw } from './types'
import { ErrorPageRoute } from './constantRouter'

const LOGIN_PATH = PageEnum.BASE_LOGIN
const LOAD_PATH = PageEnum.BASE_LOAD
const whitePathList: string[] = [LOAD_PATH] //无重定向白名单

export function createRouterGuards(router: Router) {
  const userStore = useUserStore()
  const asyncRouteStore = useAsyncRouteStore()
  router.beforeEach(async (to, from, next) => {
    // 2.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
    if (to.path === LOGIN_PATH) {
      if (userStore.loginToken) return next(from.fullPath)
      userStore.removeUserIonfo()
      return next()
    }
    // 3.判断访问页面是否在路由白名单地址(静态路由)中，如果存在直接放行
    if (whitePathList.includes(to.path as string)) return next()

    // 4.判断是否有 Token，没有重定向到 login 页面
    if (!userStore.loginToken) {
      userStore.removeUserIonfo()
      return next({ path: LOGIN_PATH, replace: true })
    }
    // 5.如果没有菜单列表，就重新请求菜单列表并添加动态路由
    if (!asyncRouteStore.isDynamicRouteAdded) {
      try {
        const routes = await asyncRouteStore.getGenerateRoutes()
        routes.forEach((item: AppRouteRecordRaw) => {
          router.addRoute(item as unknown as RouteRecordRaw)
        })
        //添加404
        const isErrorPage = router.getRoutes().findIndex(item => item.name === ErrorPageRoute.name)
        if (isErrorPage === -1) {
          router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw)
        }
        asyncRouteStore.isDynamicRouteAdded = true
        return next({ ...to, replace: true })
      } catch (err) {
        const error = err as ResponseResult<any>
        if (![2, 404].includes(error.code)) {
          return next({ path: LOAD_PATH, replace: true })
        }
      }
    }

    next()
  })

  router.onError(error => {
    console.warn('路由错误', error.message)
  })
}
