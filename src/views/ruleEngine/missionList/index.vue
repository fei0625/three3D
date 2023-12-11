<template>
  <main>
    <MSTable @register="tableRegister">
      <template #status="{ row }">
        <div>
          <el-switch
            v-if="hasPermission('rule/quartz-job/changeStatus')"
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
        <ms-button @click="handleAdd" icon="Plus" type="primary" auth="rule/quartz-job/save">{{ getI18nValue('btn.add') }}</ms-button>
      </template>
    </MSTable>

    <MSDialog @register="dialogRegister" @ok="handleConfirm" :title="title">
      <div class="flex">
        <MSForm @register="formRegister" class="flex-1">
          <template #invokeTarget="{ model, prop }">
            <el-input v-model="model[prop]" :placeholder="getI18nValue('missionList.invokeTarger1')" />
            <ul>
              <li>{{ getI18nValue('missionList.bean') }}</li>
              <li>{{ getI18nValue('missionList.class') }}</li>
              <li>{{ getI18nValue('missionList.params') }}</li>
            </ul>
          </template>
          <template #cronExpression="{ model, prop }">
            <el-input v-model="model[prop]" :placeholder="getI18nValue('missionList.cronExpression1')">
              <template #append>
                <ms-button @click="handleCronIsVisible">{{ getI18nValue('missionList.cron1') }}</ms-button>
              </template>
            </el-input>
          </template>
        </MSForm>
        <div class="w-[12%]"></div>
      </div>
    </MSDialog>

    <!-- CRON生产表达式 -->
    <MissionListLog v-model="isVisibleLog" v-if="isVisibleLog" :data="logQuery"></MissionListLog>
    <Cron v-model="cronExpressionIsVisible" @fill="cronFill" :expression="cronNumber" v-if="cronExpressionIsVisible"></Cron>
  </main>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getQuartzJobPageList, quartzJobSave, quartzJobDel, quartzJobPerform, quartzJobChangeStatus } from '@/apis/ruleEngine/missionList'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import MissionListLog from './components/MissionListLog/index.vue'
import Cron from './components/Cron/index.vue'
import { QuartzJobType } from '@/apis/ruleEngine/missionList/type'
const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')
const isVisibleLog = ref(false)
const logQuery = ref()
const cronNumber = ref('')
const cronExpressionIsVisible = ref(false)

const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getQuartzJobPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      auth: 'rule/quartz-job/save',
      tooltip: getI18nValue('btn.edit')
    },
    {
      icon: 'CaretRight',
      onClick: debounce(async (row: QuartzJobType) => {
        await quartzJobPerform(row.jobId).send()
        message.success({
          message: getI18nValue('missionList.execute')
        })
      }),
      link: true,
      auth: 'rule/quartz-job/run',
      tooltip: getI18nValue('missionList.immediateExecution')
    },
    {
      icon: 'Delete',
      onClick: handleDelete,
      link: true,
      auth: 'rule/quartz-job/removeById',
      tooltip: getI18nValue('btn.del'),
      ifShow: (data: QuartzJobType) => {
        if (data.status != '1') {
          return true
        }
        return false
      }
    },
    {
      icon: 'Tickets',
      onClick: handleLog,
      link: true,
      tooltip: getI18nValue('btn.log')
    }
  ]
})

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '26%'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({})
/** 新增*/
function handleAdd() {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('btn.add') + getI18nValue('missionList.task')
  cronNumber.value = ''
}

/**修改 */
async function handleEdit(row: QuartzJobType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('btn.edit') + getI18nValue('missionList.task')
  cronNumber.value = row.cronExpression
  formMethods.setValue(row)
}

/** 删除*/
function handleDelete(row: QuartzJobType) {
  messageBox.MessageBox({
    message: getI18nValue('msg.deleteConfirm'),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await quartzJobDel(row.jobId).send()
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
    const data = await formMethods.getValue()
    await quartzJobSave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}

/** 查看任务日志 */
function handleLog(row: QuartzJobType) {
  logQuery.value = row.jobId
  isVisibleLog.value = true
}

/** 启用/禁用 */
function changeStatus(row: QuartzJobType) {
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
          await quartzJobChangeStatus({
            jobId: row.jobId,
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

function cronFill(value: string) {
  cronNumber.value = value
  formMethods.setPropValue('cronExpression', value)
}

//打开Cron表达式页面
async function handleCronIsVisible() {
  cronExpressionIsVisible.value = true
  const { cronExpression } = await formMethods.getValue()
  cronNumber.value = cronExpression ?? ''
}
</script>
<style lang="scss" scoped>
:deep(.missionListLog .el-dialog__body) {
  padding: 0;
}
</style>
