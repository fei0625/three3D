<template>
  <MSTreeTable @register="tableRegister">
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="sys/menu/save">{{ getI18nValue('btn.add') }}</ms-button>
    </template>
  </MSTreeTable>
  <MSDialog @register="dialogRegister" @ok="handleConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
</template>
<script setup lang="ts">
import { userTreeTable, MSTreeTable } from '@/components/ms-treeTable'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getMenuTree, menuSave, menuDel } from '@/apis/system/menu'
import { tableColumns, formColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { MenuSaveType, MenuType } from '@/apis/system/menu/type'
const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')

const { register: tableRegister, methods: tableMethods } = userTreeTable({
  tableColumns: tableColumns,
  api: getMenuTree,
  isAutoHeight: true,
  actionColumn: [
    {
      icon: 'Plus',
      tooltip: getI18nValue('btn.add'),
      link: true,
      onClick: handleChildrenAdd,
      auth: 'sys/menu/save'
    },
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      auth: 'sys/menu/save',
      tooltip: getI18nValue('btn.edit')
    },
    {
      icon: 'Delete',
      onClick: handleDelete,
      link: true,
      auth: 'sys/menu/remove',
      tooltip: getI18nValue('btn.del')
    }
  ],
  treeOption: {
    pid: 'parentMenuId',
    id: 'menuId',
    children: 'children'
  },
  rowKey: 'menuId'
})

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '24%'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({})
/** 新增*/
function handleAdd() {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('sysMenu.addMenu')
}

/**修改 */
function handleEdit(row: MenuType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('sysMenu.editMenu')
  formMethods.setValue(row)
}
function handleChildrenAdd(row: MenuType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('sysMenu.editMenu')
  formMethods.setValue({ parentMenuId: row.menuId, type: row.type })
}
/** 删除*/
async function handleDelete(row: MenuType) {
  let isChildren = await tableMethods.isChildren(row.menuId)
  if (isChildren) {
    message.error({
      message: getI18nValue('sysMenu.submenusDelete')
    })
    return false
  }
  messageBox.MessageBox({
    message: getI18nValue('msg.deleteConfirm'),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        instance.confirmButtonLoading = true
        try {
          await menuDel({ menuId: row.menuId, type: row.type }).send()
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

/**保存 */
const handleConfirm = async () => {
  try {
    await formMethods.validate()
    dialogMethods.setConfirmLoading(true)
    const data: MenuSaveType = await formMethods.getValue()
    await menuSave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}
</script>
<style lang="scss" scoped></style>
