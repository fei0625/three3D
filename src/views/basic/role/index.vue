<template>
  <MSTable @register="tableRegister">
    <template #status="{ row }">
      <div>
        <div v-if="row.roleId == -1 || !hasPermission('sys/sys_role/changeStatus')">{{ getStatus(row.status) }}</div>
        <el-switch v-else :model-value="row.status" activeValue="1" inactiveValue="0" inlinePrompt @change="changeStatus(row)"></el-switch>
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="sys/sys_role/save">{{ getI18nValue('btn.add') }}</ms-button>
    </template>
  </MSTable>
  <MSDialog @register="dialogRegister" @ok="handleConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1">
        <template #menuTree>
          <el-tree
            ref="treeRef"
            check-on-click-node
            show-checkbox
            node-key="id"
            :data="rolePermissionTree"
            :props="{
              children: 'children',
              label: 'title'
            }"
            highlight-current
            :render-content="renderContent"
          />
        </template>
      </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
</template>
<script setup lang="ts">
import { hasPermission } from '@/utils/permission'
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getRolePageList, roleSave, roleDel, roleChangeStatus, roleCheckMenuId } from '@/apis/basic/role'
import { tableColumns, formColumns, searchColumns, rolePermissionTree, getRolePermissionTree } from './index'
import { getI18nValue, getI18nNoUnknownValue } from '@/utils/i18n/index'
import { RoleSaveType, RoleType } from '@/apis/basic/role/type'
const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref('')
const treeRef = ref()
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getRolePageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      auth: 'sys/vueRole/checkMenuId',
      tooltip: getI18nValue('btn.edit')
    },
    {
      icon: 'Delete',
      onClick: handleDelete,
      link: true,
      auth: 'sys/sys_role/remove',
      tooltip: getI18nValue('btn.del'),
      ifShow: (row: RoleType) => row.roleId != -1 && row.status === '0'
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
  title.value = getI18nValue('btn.add') + getI18nValue('role.role')
}

/**修改 */
async function handleEdit(row: RoleType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('btn.edit') + getI18nValue('role.role')
  await getRoleCheckMenuId(row.roleId)
  formMethods.setValue(row)
}

/** 删除*/
function handleDelete(row: RoleType) {
  messageBox.MessageBox({
    message: getI18nValue('msg.deleteConfirm'),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await roleDel({ roleId: row.roleId }).send()
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
    const data: RoleSaveType = await formMethods.getValue()
    data.menuIdList = [...treeRef.value?.getCheckedKeys(), ...treeRef.value?.getHalfCheckedKeys()]
    await roleSave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}

/** 状态转文字 */
function getStatus(status: string) {
  if (!status) {
    return ''
  }
  if (status == '1') return getI18nValue('common.enable')
  else return getI18nValue('common.disable')
}

/** 改变状态 */
function changeStatus(row: RoleType) {
  if (Object.keys(row).length == 0) return
  let status = row.status == '1' ? '0' : '1'
  let msg = status == '0' ? 'msg.disableConfirm' : 'msg.enableConfirm'
  let resMsg = status == '0' ? 'msg.disableSuccess' : 'msg.enableSuccess'
  messageBox.MessageBox({
    message: getI18nValue(msg),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await roleChangeStatus({
            roleId: row.roleId,
            status: status
          }).send()

          await tableMethods.load()
          done()
          message.success({
            message: getI18nValue(resMsg)
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

//赋值tree
async function getRoleCheckMenuId(roleId: number) {
  const { data } = await roleCheckMenuId({ roleId }).send()
  data.forEach((checkMenuId: number) => {
    var node = treeRef.value?.getNode(checkMenuId) as any
    if (node && node.isLeaf) {
      treeRef.value?.setChecked(node, true, false)
    }
  })
}

function renderContent(h: any, { data }: { data: any }) {
  data.title = getI18nNoUnknownValue(data.title)
  return h('span', null, data.title)
}

onMounted(() => {
  getRolePermissionTree()
})
</script>
<style lang="scss" scoped></style>
