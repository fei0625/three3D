import { Layout, Iframe, ParentLayout } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'
import { VueMenuType } from '@/apis/common/type'

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>()

LayoutMap.set('LAYOUT', Layout)
LayoutMap.set('IFRAME', Iframe)
LayoutMap.set('ParentLayout', ParentLayout)

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generateRoutes = (routerList: VueMenuType[], parent?: AppRouteRecordRaw): AppRouteRecordRaw[] => {
  return routerList.map((item: VueMenuType) => {
    const currentRoute: AppRouteRecordRaw = {
      path: item.path,
      component: item.component,
      name: getName(`${(parent && parent.path + '/') ?? ''}${item.path}`),
      meta: {
        title: item.title,
        icon: item.icon ?? '',
        frameSrc: item.frameSrc ?? '',
        hideMenu: item.hideMenu,
        activeMenu: item.activeMenu
      }
    }

    currentRoute.path = currentRoute.path.replace('//', '/')
    if (item.children && item.children.length > 0) {
      !item.redirect && (currentRoute.redirect = `${parent && parent.redirect ? parent.redirect : item.path}/${item.children[0].path}`)
      currentRoute.children = generateRoutes(item.children, currentRoute)
    }
    return currentRoute
  })
}

export function transformRoute(data: VueMenuType[]): VueMenuType[] {
  const routerList = data.filter(item => !/^https?:/.test(item.path))

  for (let i = 0; i < routerList.length; i++) {
    const d = routerList[i]
    if (d.menuType == 'C') {
      d.children = [deepCopy(d)]
      d.component = 'Layout'
      d.path = d.path.startsWith('/') ? d.path : '/' + d.path
      d.menuType = 'M'
    }
  }
  return routerList
}

/**
 * 查找views中对应的组件文件
 * */
let viewsModules: Record<string, () => Promise<Record<string, any>>>
export const asyncImportRoute = (routes: AppRouteRecordRaw[] | undefined): void => {
  viewsModules = viewsModules || import.meta.glob('../views/**/*.{vue,tsx}')
  if (!routes) return
  routes.forEach(item => {
    if (item.component == 'IFrame' && item.meta?.frameSrc) {
      item.component = 'IFRAME'
    }
    if (item.component.toUpperCase() == 'LAYOUT') {
      item.component = 'LAYOUT'
    }
    if (item.component.toUpperCase() == 'ParentLayout') {
      item.component = 'ParentLayout'
    }

    const { component, children } = item
    if (component) {
      const layoutFound = LayoutMap.get(component as string)
      if (layoutFound) {
        item.component = layoutFound
      } else {
        item.component = dynamicImport(viewsModules, component as string)
      }
    }
    children && asyncImportRoute(children)
  })
}

/**
 * 动态导入
 * */
export const dynamicImport = (viewsModules: Record<string, () => Promise<Record<string, any>>>, component: string) => {
  const keys = Object.keys(viewsModules)
  const matchKeys = keys.filter(key => {
    let k = key.replace('../views', '')
    const lastIndex = k.lastIndexOf('.')
    k = k.substring(0, lastIndex)
    return k === component
  })
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0]
    return viewsModules[matchKey]
  }
  if (matchKeys.length == 0) {
    console.warn('请在view目录下新建文件' + component)
    return
  }
  if (matchKeys?.length > 1) {
    console.warn('请不要创建`。和`. Vue `。在views文件夹下的相同层次目录中具有相同文件名的TSX文件。这将导致动态引入失败')
    return
  }
}

//处理层级
export function handleRouterFormat(routerList: VueMenuType[]) {
  const newRouterList: VueMenuType[] = []
  function format(routerList: VueMenuType[], path?: string) {
    for (let index = 0; index < routerList.length; index++) {
      const p = routerList[index]
      if (p.menuType == 'C') {
        const { children, ...obj } = p
        newRouterList.push(obj)
        if (children && children.length > 0) {
          for (let index = 0; index < children?.length; index++) {
            const c = children[index]
            if (c.menuType == 'C') {
              const { children, ...obj } = c
              obj.parentMenuId = null
              obj.hideMenu = '0'
              obj.activeMenu = path + '/' + p.path
              newRouterList.push(obj)
            }
          }
        }
      } else {
        const { children, ...obj } = p
        newRouterList.push(obj)
        if (children && children.length > 0) {
          const newPath = (path ?? '') + (obj.path.startsWith('/') ? obj.path : '/' + obj.path)
          format(children, newPath)
        }
      }
    }
  }
  format(routerList)
  return newRouterList
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const getMenu = (routerMap: VueMenuType[], parent?: AppRouteRecordRaw): AppRouteRecordRaw[] => {
  return routerMap.map((item: VueMenuType) => {
    let isHttp = /^https?:/.test(item.path)
    const currentRoute: AppRouteRecordRaw = {
      path: isHttp ? item.path : `${(parent && parent.path) ?? ''}/${item.path}`,
      component: item.component,
      name: isHttp ? buildUUID() : getName(`${(parent && parent.path + '/') ?? ''}${item.path}`),
      meta: {
        title: item.title,
        icon: item.icon ?? '',
        frameSrc: item.frameSrc ?? '',
        hideMenu: item.hideMenu,
        activeMenu: item.activeMenu
      }
    }

    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRoute.path = currentRoute.path.replace('//', '/')
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      !item.redirect && (currentRoute.redirect = `${parent && parent.redirect ? parent.redirect : item.path}/${item.children[0].path}`)

      currentRoute.children = getMenu(item.children, currentRoute)
    }
    return currentRoute
  })
}
function getName(d: string): string {
  let name = ''
  if (d.startsWith('/')) {
    name = d.replace('/', '').replaceAll('/', '_')
  } else {
    name = d
  }
  return name
}
