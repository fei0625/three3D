<template>
  <section class="w-full flex px-2 h-full border-b-[--ms-border-color] border-b">
    <el-tabs v-model="activeKey" class="flex-1 overflow-hidden" @tab-change="handleTo">
      <el-tab-pane :name="PageEnum.BASE_HOME_REDIRECT">
        <template #label>
          <span class="flex items-center px-2.5 h-[30px]">
            <span class="text-xs">{{ getI18nNoUnknownValue('menu.work') }}</span>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="item.fullPath" v-for="item in tabsViewStore.tabsList" :key="item.fullPath">
        <template #label>
          <span class="flex items-center px-2.5 h-[30px] group">
            <ms-tooltip :tooltip="getI18nNoUnknownValue(item.meta?.title)" :disabled="tipsMap[item.path]">
              <span class="text-xs max-w-[100px] text-center inline-block truncate" @mousemove="mousemove(item.path)">
                {{ getI18nNoUnknownValue(item.meta?.title) }}</span
              >
            </ms-tooltip>

            <ms-icon
              icon="Close"
              class="transition-all"
              :class="item.fullPath == activeKey ? 'ml-2' : 'ml-2  !w-0 group-hover:!w-3'"
              @click.stop="removeTab(item)"
              :size="12"
            ></ms-icon>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>

    <el-dropdown class="ml-4" @command="closeHandleSelect">
      <span class="flex items-center"> <ms-icon icon="ArrowDownBold" :size="12"></ms-icon> </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="1">
            <ms-icon icon="Refresh" :size="12"></ms-icon>
            刷新当前
          </el-dropdown-item>
          <el-dropdown-item command="2">
            <ms-icon icon="Close" :size="12"></ms-icon>
            关闭当前
          </el-dropdown-item>
          <el-dropdown-item command="3">
            <ms-icon icon="Close" :size="12"></ms-icon>
            关闭其他
          </el-dropdown-item>
          <el-dropdown-item command="4">
            <ms-icon icon="Close" :size="12"></ms-icon>
            关闭左侧
          </el-dropdown-item>
          <el-dropdown-item command="5">
            <ms-icon icon="Close" :size="12"></ms-icon>
            关闭右侧
          </el-dropdown-item>
          <el-dropdown-item command="6">
            <ms-icon icon="Close" :size="12"></ms-icon>
            关闭全部
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </section>
</template>
<script lang="ts" setup>
import { CacheEnumKey } from '@/enums/cacheEnum'
import { PageEnum } from '@/enums/pageEnum'
import { useTabsViewStore, RouteItem } from '@/stores/modules/tabsView'
import { get, set } from '@/utils/cache'
import { getI18nNoUnknownValue } from '@/utils/i18n/index'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'

const tabsViewStore = useTabsViewStore()
const userStore = useUserStore()
const tipsMap = ref<Record<string, boolean>>({})

const route = useRoute()
const router = useRouter()
const activeKey = ref(route.fullPath)
const reload = inject('appReload') as () => void
function mousemove(path: string) {
  if (Object.keys(tipsMap.value).includes(path)) {
    return
  }
  let dom = event?.target as HTMLElement
  tipsMap.value[path] = dom.scrollWidth > dom.offsetWidth ? false : true
}
// 获取简易的路由对象
const getSimpleRoute = (route: RouteLocationNormalizedLoaded): RouteItem => {
  const { fullPath, hash, meta, name, params, path, query } = route
  return { fullPath, hash, meta, name: name as any, params, path, query }
}
function handleTo() {
  if (activeKey.value == PageEnum.BASE_HOME_REDIRECT) {
    router.push({ path: PageEnum.BASE_HOME_REDIRECT })
    return
  }
  let data = tabsViewStore.tabsList.find(item => item.fullPath == activeKey.value)
  if (data) {
    router.push({ path: data.path, query: data.query })
  }
}

let cacheRoutes: RouteItem[] = []
const cacheRouteList = get(userStore.userInfo.staffCode + '_' + CacheEnumKey.TABS_ROUTES) as RouteItem[] | null | undefined
cacheRoutes = cacheRouteList ?? []

// 将最新的路由信息同步到 localStorage 中
const routes = router.getRoutes()
cacheRoutes.forEach(cacheRoute => {
  const route = routes.find(route => route.path === cacheRoute.path)
  if (route) {
    cacheRoute.meta = route.meta || cacheRoute.meta
  }
})
tabsViewStore.initTabs(cacheRoutes)
function setTabsRoutes() {
  set(userStore.userInfo.staffCode + '_' + CacheEnumKey.TABS_ROUTES, tabsViewStore.tabsList)
}
// 在页面关闭或刷新之前，保存数据
window.addEventListener('beforeunload', setTabsRoutes)

onUnmounted(() => {
  window.removeEventListener('beforeunload', setTabsRoutes)
})
// 关闭当前页面
const removeTab = (route: RouteItem) => {
  tabsViewStore.closeCurrentTab(route)
  // 如果关闭的是当前页
  if (activeKey.value === route.fullPath) {
    const currentRoute = tabsViewStore.tabsList[Math.max(0, tabsViewStore.tabsList.length - 1)]
    if (currentRoute) {
      activeKey.value = currentRoute.fullPath
      router.push(currentRoute)
    } else {
      activeKey.value = PageEnum.BASE_HOME_REDIRECT
      router.push({ path: PageEnum.BASE_HOME_REDIRECT })
    }
  }
}
// 关闭左侧
const closeLeft = (route: RouteItem) => {
  tabsViewStore.closeLeftTabs(route)
  activeKey.value = route.fullPath
  router.replace(route.fullPath)
}

// 关闭右侧
const closeRight = (route: RouteItem) => {
  tabsViewStore.closeRightTabs(route)
  activeKey.value = route.fullPath
  router.replace(route.fullPath)
}

// 关闭其他
const closeOther = (route: RouteItem) => {
  tabsViewStore.closeOtherTabs(route)
  activeKey.value = route.fullPath
  router.replace(route.fullPath)
}

// 关闭全部
const closeAll = () => {
  tabsViewStore.closeAllTabs()
  activeKey.value = PageEnum.BASE_HOME_REDIRECT
  router.replace(PageEnum.BASE_HOME_REDIRECT)
}

//tab 操作
const closeHandleSelect = (key: string) => {
  switch (key) {
    //刷新
    case '1':
      reload()
      break
    //关闭当前
    case '2':
      removeTab(getSimpleRoute(route))
      break
    //关闭其他
    case '3':
      closeOther(getSimpleRoute(route))
      break
    //关闭左侧
    case '4':
      closeLeft(getSimpleRoute(route))
      break
    // 关闭右侧
    case '5':
      closeRight(getSimpleRoute(route))
      break
    //关闭所有
    case '6':
      closeAll()
      break
  }
}
const whiteList: string[] = [PageEnum.BASE_HOME_REDIRECT]
watch(
  () => route.fullPath,
  to => {
    if (PageEnum.BASE_HOME_REDIRECT === to) {
      activeKey.value = PageEnum.BASE_HOME_REDIRECT
    }
    if (whiteList.includes(to as string)) return
    const isAddTab = tabsViewStore.addTab(getSimpleRoute(route))
    if (isAddTab) {
      activeKey.value = to
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" src="./styles.scss" scoped />
