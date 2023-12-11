<template>
  <MSTreeTable @register="tableRegister">
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="sys/org/save">{{ getI18nValue('btn.add') }}</ms-button>
    </template>
    <template #status="{ row }">
      <div>
        <el-switch
          v-if="hasPermission('sys/org/changeStatus')"
          :model-value="row.status"
          activeValue="1"
          inactiveValue="0"
          @change="changeStatus(row)"
        ></el-switch>
        <div v-else>{{ getStatus(row.status) }}</div>
      </div>
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
import { getOrgTree, orgSave, orgDel, orgChangeStatus } from '@/apis/basic/org'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { OrgSaveType, OrgType } from '@/apis/basic/org/type'
const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')

const { register: tableRegister, methods: tableMethods } = userTreeTable({
  tableColumns: tableColumns,
  api: getOrgTree,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'Plus',
      tooltip: getI18nValue('btn.add'),
      link: true,
      onClick: handleChildrenAdd,
      auth: 'sys/org/save'
    },
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      auth: 'sys/org/save',
      tooltip: getI18nValue('btn.edit')
    },
    {
      icon: 'Delete',
      onClick: handleDelete,
      link: true,
      auth: 'sys/org/remove',
      tooltip: getI18nValue('btn.del'),
      ifShow: (data: OrgType) => {
        return data.status !== '1'
      }
    }
  ],
  treeOption: {
    pid: 'parentOrgId',
    id: 'orgId',
    children: 'children'
  },
  rowKey: 'orgId'
})

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '23%'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({})
/** 新增*/
function handleAdd() {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('org.Adds')
}

function handleChildrenAdd(row: OrgType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('btn.add') + getI18nValue('org.subnode')
  formMethods.setValue({ parentOrgId: row.orgId })
}

/**修改 */
function handleEdit(row: OrgType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('org.edits')
  formMethods.setValue(row)
}

/** 删除*/
function handleDelete(row: OrgType) {
  messageBox.MessageBox({
    message: getI18nValue('msg.deleteConfirm'),
    beforeClose: async (action: any, instance: any, done: any) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await orgDel(row.orgId).send()
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
    const data: OrgSaveType = await formMethods.getValue()
    await orgSave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}

/** 启用/禁用 */
function changeStatus(row: OrgType) {
  if (Object.keys(row).length == 0) return
  let status = row.status == '1' ? '0' : '1'
  let msg = status == '0' ? 'msg.disableConfirm' : 'msg.enableConfirm'
  let messages = status == '0' ? 'msg.disableSuccess' : 'msg.enableSuccess'
  messageBox.MessageBox({
    message: getI18nValue(msg),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await orgChangeStatus({
            orgId: row.orgId,
            status: status
          }).send()
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

/**
 * 修改状态
 */
function getStatus(status: string) {
  if (!status) {
    return ''
  }
  if (status == '1') return getI18nValue('common.enable')
  else return getI18nValue('common.disable')
}
</script>
<style lang="scss" scoped></style>
