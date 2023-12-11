import { defineStore } from 'pinia'
import { VueMenuType } from '@/apis/common/type'
import { asyncImportRoute, generateRoutes, getMenu, handleRouterFormat, transformRoute } from '@/router/generator'
import { getFlushVueAuth, getVueMenu } from '@/apis/common'
import { AppRouteRecordRaw } from '@/router/types'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { get } from '@/utils/cache'

export const useAsyncRouteStore = defineStore('async-route', () => {
  const staffCode = get(CacheEnumKey.STAFF)?.staffCode
  const orgRouterList = ref<VueMenuType[]>([]) //原生路由
  const isDynamicRouteAdded = ref<boolean>(false) //是否添加过动态路由
  const authMap = ref<Record<string, string>>({}) //权限map
  const getNavList = computed(() => orgRouterList.value.filter(item => item.hideMenu == '1'))
  const activeNav = ref<string>(get(staffCode + '_' + CacheEnumKey.ACTIVENAV) ?? '') //当前激活的导航
  const getMenus = computed<AppRouteRecordRaw[]>(() => {
    const menu = orgRouterList.value.find((item: VueMenuType) => item.path == activeNav.value)
    let newRoutesList: VueMenuType[] = []
    if (menu) {
      newRoutesList = menu.children ?? []
    }
    newRoutesList = newRoutesList.map(item => ({ ...item, parentMenuId: null }))
    newRoutesList = handleRouterFormat(newRoutesList)
    newRoutesList = listTree(newRoutesList, {
      pid: 'parentMenuId',
      id: 'menuId',
      children: 'children'
    })
    return getMenu(newRoutesList)
  }) //侧边菜单栏

  const getGenerateRoutes = async () => {
    try {
      const { data } = await getVueMenu().send()
      const { data: userAuthMap } = await getFlushVueAuth().send()
      authMap.value = userAuthMap.userMenu

      for (let index = 0; index < data.length; index++) {
        const d: VueMenuType = data[index]
        let arr = []
        if (d.children && d.children.length > 0) {
          for (let j = 0; j < d.children.length; j++) {
            const c = d.children[j]
            if (c.menuType == 'M' && !c.path.startsWith('/')) {
              continue
            }
            arr.push(c)
          }
        }
        d.children = arr
      }
      orgRouterList.value = deepCopy(data)
      let newRoutesList: VueMenuType[] = []
      //遍历路由
      data.forEach((item: VueMenuType) => {
        if (item.children && item.children.length > 0) {
          newRoutesList.push(...item.children.map(item => ({ ...item, parentMenuId: null })))
        }
      })
      if (!activeNav.value) {
        activeNav.value = orgRouterList.value[0].path
      }
      newRoutesList = handleRouterFormat(newRoutesList)

      newRoutesList = listTree(newRoutesList, {
        pid: 'parentMenuId',
        id: 'menuId',
        children: 'children'
      })
      newRoutesList = transformRoute(newRoutesList)
      const accessedRouters = generateRoutes(newRoutesList)
      asyncImportRoute(accessedRouters)
      return toRaw(accessedRouters)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  return {
    authMap,
    getNavList,
    activeNav,
    getMenus,
    isDynamicRouteAdded,
    getGenerateRoutes
  }
})
