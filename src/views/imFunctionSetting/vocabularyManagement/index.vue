<template>
  <div class="bg-[--ms-bg] rounded-lg p-5 h-screen">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="getI18nValue('imVocabulary.wordMaintenance')" name="tab1">
        <WordMaintenance v-if="activeName == 'tab1'" :wordCategoriesRowData="wordCategoriesRow"></WordMaintenance>
      </el-tab-pane>
      <el-tab-pane :label="getI18nValue('imVocabulary.wordCategories')" name="tab2">
        <WordCategories v-if="activeName == 'tab2'"></WordCategories>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'

import WordMaintenance from './wordMaintenance/index.vue'
import WordCategories from './wordCategories/index.vue'
import { ImViolationType } from '@/apis/imFunctionSetting/vocabularyManagement/type'

const activeName = ref('tab1')
const wordCategoriesRow = ref({} as ImViolationType)
provide('wordCategories', (row: ImViolationType) => {
  wordCategoriesRow.value = row
  activeName.value = 'tab1'
})
</script>
<style lang="scss" scoped>
:deep(.ms-table-content) {
  padding: 0px;
}
:deep(.ms-table-search) {
  padding: 0;
  margin-bottom: 0px;
}
</style>
