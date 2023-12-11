// typings.d.ts or router.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title: string //菜单名称
    icon?: string //菜单图标
    menuType?: string //菜单类型 N导航 M菜单 C目录 F按钮
    frameSrc?: string //跳转地址
    hideMenu?: string //hideMenu
    activeMenu?: string //激活父菜单
  }
}
