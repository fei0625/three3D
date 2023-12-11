<template>
  <MSTable @register="register"> </MSTable>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { getLoginLogPageList } from '@/apis/log/loginLog'
import { tableColumns, searchColumns } from './index'
const { register } = useTable({
  tableColumns: tableColumns,
  api: getLoginLogPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  onBeforeLoad: params => {
    let { DatePicker = [], ...obj } = params
    return { endTime: DatePicker[1], startTime: DatePicker[0], ...obj }
  }
})
</script>
<style lang="less" scoped></style>
