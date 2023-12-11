<template>
  <MSDialog @register="dialogRegister" :title="getI18nValue('missionList.taskListLog')" class="missionListLog">
    <MSTable @register="tableRegister" :height="300"> </MSTable>
  </MSDialog>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getQuartzJobLogPageList } from '@/apis/ruleEngine/missionList'
import { tableColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'

const props = defineProps<{ data: number; modelValue: boolean }>()
const emits = defineEmits(['update:modelValue'])
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  width: '70%',
  isCancel: false,
  isConfirm: false,
  isMaxHeight: false,
  onClose: () => {
    emits('update:modelValue', false)
  }
})
const { register: tableRegister } = useTable({
  tableColumns: tableColumns,
  api: getQuartzJobLogPageList,
  extrasSearchParams: { jobId: props.data },
  showPagination: true,
  searchColumns: searchColumns
})
onMounted(() => {
  dialogMethods.setIsVisible(true)
})
</script>
<style lang="scss" scoped>
:deep(.ms-table-content) {
  padding-top: 0px;
}
:deep(.ms-table-search) {
  margin-bottom: 0px;
}
</style>
