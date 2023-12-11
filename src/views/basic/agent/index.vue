<template>
  <MSTable @register="tableRegister">
    <template #logo="{ row }">
      <div class="flex items-center">
        <el-image class="w-5 h-5" :src="row.logo">
          <template #error>
            <ms-icon icon="Picture" :size="20"></ms-icon>
          </template>
        </el-image>
      </div>
    </template>
    <template #status="{ row }">
      <div>
        <el-switch
          v-if="hasPermission('sys/agent/changeStatus')"
          :model-value="row.status"
          activeValue="1"
          inactiveValue="0"
          @change="changeStatus(row)"
          :disabled="row.staffId == -1"
        ></el-switch>
        <div v-else>{{ getStatus(row.status) }}</div>
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="sys/agent/save">{{ getI18nValue('btn.add') }}</ms-button>
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
import { getAgentPageList, agentSave, agentChangeStatus } from '@/apis/basic/agent'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { router } from '@/router/index'
import { AgentSaveType, AgentType } from '@/apis/basic/agent/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')

const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getAgentPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'View',
      onClick: handleView,
      link: true,
      tooltip: getI18nValue('btn.detail')
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
  title.value = getI18nValue('agent.addAgent')
}

/** 详情 */
function handleView(row: AgentType) {
  router.push({ path: '/agentDetail', query: { agentId: row.agentId } })
}

/**保存 */
const handleConfirm = async () => {
  try {
    await formMethods.validate()
    dialogMethods.setConfirmLoading(true)
    const data: AgentSaveType = await formMethods.getValue()
    await agentSave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}

/** 启用/禁用 */
function changeStatus(row: AgentType) {
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
          await agentChangeStatus({
            agentId: row.agentId,
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
function getStatus(status: string) {
  if (!status) {
    return ''
  }
  if (status == '1') return getI18nValue('common.enable')
  else return getI18nValue('common.disable')
}
</script>
