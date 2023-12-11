<template>
  <div class="bg-[var(--ms-bg)] rounded-lg h-full">
    <el-tabs v-model="activeName" class="px-5">
      <el-tab-pane :label="getI18nValue('violationManagement.user')" name="user" auth="tr069-protocol/page">
        <User v-if="activeName == 'user'"></User>
      </el-tab-pane>
      <el-tab-pane :label="getI18nValue('violationManagement.group')" name="group" auth="snmpProtocol/page">
        <Group v-if="activeName == 'group'"></Group>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import User from './user/index.vue'
import Group from './group/index.vue'
import { getI18nValue } from '@/utils/i18n/index'
const activeName = ref<any>('user')
</script>
