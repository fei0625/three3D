<template>
  <el-dropdown @command="handleCommand">
    <span class="header-text flex items-center text-white">
      <div class="mr-1" style="font-size: 14px">{{ globalStore.global.language == 'zh_CN' ? '简体中文' : 'English' }}</div>
      <ms-icon icon="ArrowDown"></ms-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh_CN"> 中文</el-dropdown-item>
        <el-dropdown-item command="en_US">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
const i18n = useI18n()
function handleCommand(item: string) {
  i18n.locale.value = item
  globalStore.global.language = item
  location.reload()
}
</script>
<style lang="scss" scoped></style>
