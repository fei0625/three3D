<template>
  <header class="header">
    <article class="header-logo"><ms-logo></ms-logo></article>
    <article class="header-main">
      <section class="header-main-nav">
        <div
          v-for="(item, index) in asyncRouteStore.getNavList"
          :key="index"
          class="text-[--ms-header-color] text-xs cursor-pointer mr-10"
          :class="asyncRouteStore.activeNav == item.path ? '!text-[--ms-color]' : ''"
          @click="handleToggleRouter(item)"
        >
          {{ getI18nNoUnknownValue(item.title) }}
        </div>
      </section>
      <section class="header-main-avatar">
        <ms-i18n class="i18n"></ms-i18n>
        <ms-icon icon="Setting" class="ml-4 cursor-pointer" :size="18" @click="drawerVisible = true"></ms-icon>
        <el-dropdown class="ml-4" @command="handleCommand">
          <span class="flex items-center text-[--ms-header-color]">{{ userName }} </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="1"><ms-icon icon="SwitchButton"></ms-icon>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </section>
    </article>
  </header>
  <ThemeDrawer v-model="drawerVisible"></ThemeDrawer>
</template>
<script setup lang="ts">
import { getI18nNoUnknownValue, getI18nValue } from '@/utils/i18n'
import { useUserStore } from '@/stores/modules/user'
import { PageEnum } from '@/enums/pageEnum'
import { useAsyncRouteStore } from '@/stores/modules/asyncRoute'
import { useTabsViewStore } from '@/stores/modules/tabsView'
import { CacheEnumKey } from '@/enums/cacheEnum'
import ThemeDrawer from './ThemeDrawer/index.vue'
import { set } from '@/utils/cache'
import { loginLogout } from '@/apis/login'
import { VueMenuType } from '@/apis/common/type'
const asyncRouteStore = useAsyncRouteStore()
const tabsViewStore = useTabsViewStore()
const userStore = useUserStore()
const drawerVisible = ref(false)
const router = useRouter()
const userName = computed(() => {
  const { lastName, firstName } = userStore.userInfo
  return `${firstName}.${lastName}`
})
async function handleToggleRouter(data: VueMenuType) {
  tabsViewStore.closeAllTabs()
  set(userStore.userInfo.staffCode + '_' + CacheEnumKey.TABS_ROUTES, [])
  if (/^https?:/.test(data.path)) {
    window.open(data.path, '_black')
    return
  }
  asyncRouteStore.activeNav = data.path
  set(userStore.userInfo.staffCode + '_' + CacheEnumKey.ACTIVENAV, data.path)
  router.push({ path: PageEnum.BASE_HOME_REDIRECT })
}
function handleCommand(command: string) {
  switch (command) {
    case '1':
      new useMessageBox().MessageBox({
        message: getI18nValue('login.isToLogout'),
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action == 'confirm') {
            try {
              instance.confirmButtonLoading = true
              await loginLogout().send()
              userStore.removeUserIonfo()
              router.replace(PageEnum.BASE_LOGIN)
              done()
            } finally {
              instance.confirmButtonLoading = false
            }
          } else {
            done()
          }
        }
      })
      break
    case '2':
      break
  }
}
</script>
<style lang="scss" src="./styles.scss" scoped />
