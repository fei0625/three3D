<template>
  <MSTable @register="tableRegister">
    <template #icon="{ row }">
      <div class="flex items-center">
        <el-image class="w-10 h-10" :src="row.icon">
          <template #error>
            <ms-icon icon="Picture" :size="20"></ms-icon>
          </template>
        </el-image>
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="imSystemNumber/save">{{ getI18nValue('btn.add') }}</ms-button>
    </template>
  </MSTable>
  <MSDialog @register="dialogRegister" @ok="handleConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1"> </MSForm>

      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getSystemNumberPage, save } from '@/apis/imSystemNumberNotification/systemNumberManagement'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { router } from '@/router/index'
import { ImSystemNumber } from '@/apis/imSystemNumberNotification/systemNumberManagement/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')

const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getSystemNumberPage,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      auth: 'imSystemNumber/save',
      tooltip: getI18nValue('btn.edit')
    }
  ]
})

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '15%'
})

const { register: dialogRegister, methods: dialogMethods } = useDialog({})

/** 新增*/
function handleAdd() {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('imSystemNumber.addSystemNumber')
}

/** 修改 */
function handleEdit(row: ImSystemNumber) {
  dialogMethods.setIsVisible(true)
  formMethods.setValue(row)
  title.value = getI18nValue('imSystemNumber.editSystemNumber')
}

/**保存 */
const handleConfirm = async () => {
  try {
    await formMethods.validate()
    dialogMethods.setConfirmLoading(true)
    const data: ImSystemNumber = await formMethods.getValue()
    await save(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}
</script>
