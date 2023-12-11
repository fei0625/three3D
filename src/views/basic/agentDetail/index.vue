<template>
  <div class="bg-[--ms-bg] h-full rounded-lg">
    <div class="flex justify-end pr-2.5 pt-2.5">
      <ms-button @click="$router.back()" icon="Back" :tooltip="getI18nValue('btn.back')"></ms-button>
    </div>
    <el-tabs v-model="activeName" class="px-5">
      <el-tab-pane :label="getI18nValue('agentDetail.basicInformation')" name="detail">
        <Detail v-if="activeName == 'detail'"></Detail>
      </el-tab-pane>
      <el-tab-pane :label="getI18nValue('agentDetail.memberManagement')" name="staffManage">
        <Staff v-if="activeName == 'staffManage'"></Staff>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import Staff from './components/Staff/index.vue'
import Detail from './components/Detail/index.vue'
import { getI18nValue } from '@/utils/i18n/index'

const activeName = ref('detail')
</script>
<style lang="scss" scoped></style>
