<template>
  <div class="flex items-center py-1 px-5 bg-[--ms-main] border-b border-b-[--ms-border-color]" v-if="expiration.expiration">
    <p class="flex-1 flex justify-center text-xs">{{ getI18nValue('common.codeCaseExpire') }}</p>
    <div class="flex">
      <ms-button type="primary" @click="handleExpirationOpen">{{ getI18nValue('common.editCodeCase') }}</ms-button>
      <ms-button @click="handleExpirationClose">{{ getI18nValue('btn.cancel') }}</ms-button>
    </div>
  </div>
  <section class="ms-container" :class="expiration.expiration ? 'h-[calc(100vh-32px)] ' : 'h-screen'" v-if="!globalStore.lockStatus">
    <PageHeader />
    <section class="ms-container-box">
      <AsideMenu />
      <article class="ms-container-box-content">
        <nav class="ms-container-box-content-nav" v-if="globalStore.global.tabs">
          <TabsView></TabsView>
        </nav>
        <section class="ms-container-box-content-box" :style="{ height: msContainerBox }">
          <MainView v-if="isRouterAlive" />
        </section>
        <article class="ms-container-box-content-footer" v-if="globalStore.global.footer">
          Copyright &nbsp;© 2022湖南麦石信息技术有限公司
          <a href="https://beian.miit.gov.cn" class="text-[--ms-color]">&nbsp;湘ICP备2022003350号-1 </a>
        </article>
      </article>
    </section>
  </section>
  <ms-reset-password v-model="isVisible" :data="resetPasswordData" v-if="isVisible"></ms-reset-password>
  <LockScreen @timekeeping="timekeeping" v-if="globalStore.lockStatus" />
</template>
<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n'
import { MainView } from './components/Main'
import { PageHeader } from './components/Header'
import { AsideMenu } from './components/Menu'
import { TabsView } from './components/TagsView'
import LockScreen from './components/LockScreen/index.vue'
import {
  timekeeping,
  globalStore,
  isVisible,
  resetPasswordData,
  expiration,
  getOneLogin,
  overduePrompt,
  handleExpirationOpen,
  handleExpirationClose
} from './index'
defineOptions({
  name: 'Layout'
})
const isRouterAlive = ref(true)

function reload() {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
provide('appReload', reload)
const msContainerBox = computed(() => {
  if (globalStore.global.tabs && globalStore.global.footer) {
    return `calc(100% - 59px)`
  } else if (globalStore.global.tabs) {
    return `calc(100% - 30px)`
  } else if (globalStore.global.footer) {
    return `calc(100% - 29px)`
  }
  return '100%'
})

onMounted(() => {
  overduePrompt()
  getOneLogin()
  document.addEventListener('mousedown', timekeeping)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', timekeeping)
})
watch(
  () => globalStore.systemConfig,
  () => {
    timekeeping()
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" src="./styles.scss" scoped />
