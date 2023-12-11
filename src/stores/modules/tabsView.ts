import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'

export type RouteItem = Partial<RouteLocationNormalized> & {
  fullPath: string
  path: string
  name: string
  hash: string
  meta: object
  params: object
  query: object
}

export const useTabsViewStore = defineStore('tabsView', () => {
  const tabsList = ref<RouteItem[]>([])
  const initTabs = (routes: RouteItem[]) => {
    // 初始化标签页
    tabsList.value = routes
  }
  const addTab = (route: RouteItem): boolean => {
    // 添加标签页
    const isExists = tabsList.value.some(item => item.fullPath == route.fullPath)
    if (!isExists) {
      tabsList.value.push(route)
    }
    return true
  }
  const closeLeftTabs = (route: RouteItem) => {
    // 关闭左侧
    const index = tabsList.value.findIndex(item => item.fullPath == route.fullPath)
    tabsList.value = tabsList.value.filter((_item, i) => i >= index)
  }
  const closeRightTabs = (route: RouteItem) => {
    // 关闭右侧
    const index = tabsList.value.findIndex(item => item.fullPath == route.fullPath)
    tabsList.value = tabsList.value.filter((_item, i) => i <= index)
  }
  const closeOtherTabs = (route: RouteItem) => {
    // 关闭其他
    tabsList.value = tabsList.value.filter(item => item.fullPath == route.fullPath)
  }
  const closeCurrentTab = (route: RouteItem) => {
    // 关闭当前页
    const index = tabsList.value.findIndex(item => item.fullPath == route.fullPath)
    tabsList.value.splice(index, 1)
  }
  const closeAllTabs = () => {
    // 关闭全部
    tabsList.value = []
  }
  return { tabsList, initTabs, addTab, closeLeftTabs, closeRightTabs, closeOtherTabs, closeCurrentTab, closeAllTabs }
})
