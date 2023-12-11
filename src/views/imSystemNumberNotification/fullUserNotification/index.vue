<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
import SystemNumberNotification from './components/systemNumberNotification/index.vue'
import SystemNotification from './components/systemNotification/index.vue'

const activeName = ref('tab1')
</script>
<template>
  <div class="bg-[--ms-bg] h-screen rounded-lg p-5">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="getI18nValue('fullUserNotification.systemNumberNotification')" name="tab1">
        <SystemNumberNotification v-if="activeName == 'tab1'"></SystemNumberNotification>
      </el-tab-pane>
      <el-tab-pane :label="getI18nValue('fullUserNotification.systemNotification')" name="tab2">
        <SystemNotification v-if="activeName == 'tab2'"></SystemNotification>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
