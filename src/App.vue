<template>
  <Suspense>
    <el-config-provider size="small" :locale="globalStore.global.language == 'zh_CN' ? zhCn : enLocale">
      <router-view></router-view>
    </el-config-provider>
  </Suspense>
</template>
<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import enLocale from 'element-plus/dist/locale/en.mjs'
import { useTheme } from './hooks/useTheme'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
// init theme
const { initTheme } = useTheme()
initTheme()
onMounted(async () => {
  // globalStore.initystemConfig()
})
</script>
