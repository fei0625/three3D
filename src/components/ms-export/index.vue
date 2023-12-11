<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
const props = defineProps<{
  auth?: string
}>()
const emits = defineEmits(['change'])
const isHide = ref(true)

function handleExport(suffix: string) {
  emits('change', suffix)
}

function hasShow() {
  if (props.auth) {
    isHide.value = false
    if (hasPermission(props.auth)) {
      isHide.value = true
    }
  }
}
onMounted(() => {
  hasShow()
})
</script>
<template>
  <el-dropdown @command="handleExport" v-if="isHide">
    <div>
      <ms-button icon="Download" type="primary"
        ><slot> {{ getI18nValue('btn.export') }}</slot></ms-button
      >
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command=".xlsx">.xlsx</el-dropdown-item>
        <el-dropdown-item command=".xls">.xls</el-dropdown-item>
        <el-dropdown-item command=".csv">.csv</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
