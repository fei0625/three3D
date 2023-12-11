<template>
  <MSTable @register="tableRegister"> </MSTable>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { getOperationHistoryPageList } from '@/apis/imOperation/operationHistory/index'
import { tableColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { router } from '@/router/index'
import { OperationHistoryPageListType } from '@/apis/imOperation/operationHistory/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')

const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getOperationHistoryPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [],
  onBeforeLoad: params => {
    let { DatePicker = [], ...obj } = params
    return { endTime: DatePicker[1], startTime: DatePicker[0], ...obj }
  }
})
</script>
