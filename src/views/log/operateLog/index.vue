<template>
  <MSTable @register="tableRegister"> </MSTable>
  <MSDialog @register="dialogRegister" :title="getI18nValue('common.information')">
    <pre>
      {{ msg }}
      </pre
    >
    <template #footer>
      <ms-button type="primary" @click="handleClose">{{ getI18nValue('btn.confirm') }}</ms-button>
    </template>
  </MSDialog>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getOperatLogPageList } from '@/apis/log/operateLog'
import { tableColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { OperatLogType } from '@/apis/log/operateLog/type'
const msg = ref('')

const { register: tableRegister } = useTable({
  tableColumns: tableColumns,
  api: getOperatLogPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  onBeforeLoad: params => {
    let { DatePicker = [], ...obj } = params
    return { endTime: DatePicker[1], startTime: DatePicker[0], ...obj }
  },
  actionColumn: [
    {
      icon: 'View',
      onClick: watchMsg,
      link: true,
      auth: 'log/operatLog/list',
      ifShow: (data: OperatLogType) => {
        return data.exception ? true : false
      },
      tooltip: getI18nValue('operateLog.logDetails')
    }
  ]
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  isCancel: false,
  isConfirm: false
})
//查看
function watchMsg(row: OperatLogType) {
  msg.value = row.exception
  dialogMethods.setIsVisible(true)
}
//退出
function handleClose() {
  dialogMethods.setIsVisible(false)
}
</script>
<style lang="scss" scoped></style>
