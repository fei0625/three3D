<template>
  <MSTable @register="tableRegister">
    <template #status="{ row }">
      <div>
        <el-switch
          v-if="hasPermission('imVocabulary/save')"
          :model-value="row.status"
          :activeValue="1"
          :inactiveValue="0"
          @change="changeStatus(row)"
        ></el-switch>
        <div v-else>{{ getStatus(row.status) }}</div>
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="imVocabulary/save">{{ getI18nValue('btn.add') }}</ms-button>
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
import { getImViolationTypePageList, imViolationTypeSave, imViolationTypeDel } from '@/apis/imFunctionSetting/vocabularyManagement'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { ImViolationType } from '@/apis/imFunctionSetting/vocabularyManagement/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')
const wordCategoriesRow = inject<(row: ImViolationType) => void>('wordCategories')
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getImViolationTypePageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      tooltip: getI18nValue('btn.edit')
    },
    {
      icon: 'Delete',
      onClick: handleDel,
      link: true,
      tooltip: getI18nValue('btn.del')
    },
    {
      icon: 'View',
      onClick: handleView,
      link: true,
      tooltip: getI18nValue('btn.view')
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
  title.value = getI18nValue('imVocabulary.addType')
}

/** 修改 */
function handleEdit(row: ImViolationType) {
  dialogMethods.setIsVisible(true)
  formMethods.setValue(row)
  title.value = getI18nValue('imVocabulary.editType')
}

/** 删除 */
function handleDel(row: ImViolationType) {
  messageBox.MessageBox({
    message: getI18nValue('msg.deleteConfirm'),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await imViolationTypeDel(row.id).send()
          await tableMethods.load()
          done()
          message.success({
            message: getI18nValue('msg.deleteSuccess')
          })
        } finally {
          instance.confirmButtonLoading = false
        }
      } else {
        done()
      }
    }
  })
}

/** 查看 */
function handleView(row: ImViolationType) {
  wordCategoriesRow && wordCategoriesRow(row)
}

/**保存 */
const handleConfirm = async () => {
  try {
    await formMethods.validate()
    dialogMethods.setConfirmLoading(true)
    const data: ImViolationType = await formMethods.getValue()
    await imViolationTypeSave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}

/** 启用/禁用 */
function changeStatus(row: ImViolationType) {
  if (Object.keys(row).length == 0) return
  const status = row.status == 1 ? 0 : 1
  const msg = status == 0 ? 'msg.disableConfirm' : 'msg.enableConfirm'
  const messages = status == 0 ? 'msg.disableSuccess' : 'msg.enableSuccess'
  messageBox.MessageBox({
    message: getI18nValue(msg),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          row.status = status
          await imViolationTypeSave(row).send()
          await tableMethods.load()
          done()
          message.success({
            message: getI18nValue(messages)
          })
        } finally {
          instance.confirmButtonLoading = false
        }
      } else {
        done()
      }
    }
  })
}
function getStatus(status: number) {
  if (!status) {
    return ''
  }
  if (status == 1) return getI18nValue('common.enable')
  else return getI18nValue('common.disable')
}
</script>
