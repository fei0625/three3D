<template>
  <MSTable @register="tableRegister">
    <template #violatingContent="{ row }">
      <div>
        <div
          class="w-120px text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
          style="color: blue"
          v-if="row.imUserViolationsLog.violatingContent"
          @click="handleViolatingContent(row.imUserViolationsLog.violatingContent)"
        >
          {{ row.imUserViolationsLog.violatingContent }}
        </div>
        <div class="w-120px" style="color: blue" v-else>--</div>
      </div>
    </template>
    <template #sensitiveStatus="{ row }">
      <div>
        <div v-if="!hasPermission('im/violationManagement/changeStatus')">{{ getStatus(row.sensitiveStatus) }}</div>
        <el-switch v-else :model-value="row.sensitiveStatus" :activeValue="1" :inactiveValue="0" inlinePrompt @change="changeStatus(row)"></el-switch>
      </div>
    </template>
  </MSTable>

  <MSDialog @register="dialogRegister" :title="title">
    <el-timeline>
      <el-timeline-item v-for="(item, index) in logList" :key="index">
        <div class="flex justify-between">
          <div>{{ item.createTime }}</div>
          <div class="pr-4">
            {{ item.violationsTypeName }}
          </div>
        </div>
        <div class="px-[35px] py-[30px] mt-[14px] border border-light-200 rounded-xl">
          <h4>{{ item.remarkFormatter }}</h4>
          <p>{{ getI18nValue('violationManagement.violation') }}:</p>
          <p>{{ item.violatingContent }}</p>
        </div>
      </el-timeline-item>
    </el-timeline>
  </MSDialog>

  <MSDialog @register="dialogRelieveRegister" :title="title" @ok="handleConfirm">
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('violationManagement.unblockUnban') }}</p>
    <el-form :model="userDetailsLog" label-width="120px">
      <el-form-item :label="getI18nValue('violationManagement.reasonsRelease')">
        <el-input v-model="userDetailsLog.banRemark" type="textarea" />
      </el-form-item>
    </el-form>
  </MSDialog>

  <MSDialog @register="dialogProlongRegister" :title="title" @ok="handleProlongConfirm">
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('violationManagement.extension') }}</p>
    <el-form :model="userDetailsLog" label-width="120px">
      <el-form-item :label="getI18nValue('violationManagement.lengthenTime')">
        <el-select v-model="userDetailsLog.number" :placeholder="getI18nValue('violationManagement.extension')">
          <el-option :label="getI18nValue('violationManagement.day')" :value="1" />
          <el-option :label="getI18nValue('violationManagement.week')" :value="7" />
          <el-option :label="getI18nValue('violationManagement.month')" :value="30" />
        </el-select>
      </el-form-item>
      <el-form-item :label="getI18nValue('violationManagement.groundsExtension')">
        <el-input v-model="userDetailsLog.violatingContent" type="textarea" />
      </el-form-item>
    </el-form>
  </MSDialog>

  <MSDialog @register="dialogViolatingContentRegister" :title="getI18nValue('violationManagement.violation')">
    <div class="w-[100%] whitespace-pre-wrap break-words">
      {{ violatingContentView }}
    </div>
  </MSDialog>
</template>
<script setup lang="ts">
import { hasPermission } from '@/utils/permission'
import { useTable, MSTable } from '@/components/ms-table'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import {
  getUserPageList,
  getUserImViolationTypeList,
  getUserUpdateById,
  getUserRelieveUpdateById,
  getUserChangeStatus
} from '@/apis/imOperation/violationManagement/index'
import { tableColumns, searchColumns } from './index'
import { getI18nValue, getI18nNoUnknownValue } from '@/utils/i18n/index'
import { ImGroupPageListType, ImUserPageListType, ImViolationsTypeLogList, UserInfoStatusType } from '@/apis/imOperation/violationManagement/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const violatingContentView = ref()
const title = ref('')
const logList = ref([])
const userDetailsLog = ref({})
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  isConfirm: false,
  isCancel: false
})

const { register: dialogRelieveRegister, methods: dialogRelieveMethods } = useDialog({})
const { register: dialogProlongRegister, methods: dialogProlongMethods } = useDialog({})
const { register: dialogViolatingContentRegister, methods: dialogViolatingContentMethods } = useDialog({})
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getUserPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  onBeforeLoad: params => {
    let { DatePicker = [], ...obj } = params
    return { endTime: DatePicker[1], startTime: DatePicker[0], ...obj }
  },
  actionColumn: [
    {
      icon: 'Lock',
      onClick: handleReleaseSeal,
      link: true,
      tooltip: getI18nValue('violationManagement.liftBan'),
      auth: 'im/violationManagement/userUpdateById',
      ifShow: (row: any) => {
        if (row.imUserViolationsLog.processing == 1 && row.imUserViolationsLog.postpone != -1 && row.imUserViolationsLog.postpone != 0) {
          return true
        }
        return false
      }
    },
    {
      icon: 'Lock',
      onClick: handleLiftBan,
      link: true,
      tooltip: getI18nValue('violationManagement.unblock'),
      auth: 'im/violationManagement/userUpdateById',
      ifShow: (row: any) => {
        if (row.imUserViolationsLog.processing == 2 && row.imUserViolationsLog.postpone != -1 && row.imUserViolationsLog.postpone != 0) {
          return true
        }
        return false
      }
    },
    {
      icon: 'VideoPlay',
      onClick: handleDelay,
      link: true,
      tooltip: getI18nValue('violationManagement.extend'),
      auth: 'im/violationManagement/prolong',
      ifShow: (row: any) => {
        if (
          (row.imUserViolationsLog.processing == 1 && row.imUserViolationsLog.postpone != 0 && row.imUserViolationsLog.postpone != -1) ||
          (row.imUserViolationsLog.processing == 2 && row.imUserViolationsLog.postpone != 0 && row.imUserViolationsLog.postpone != -1)
        ) {
          return true
        }
        return false
      }
    },
    {
      icon: 'Document',
      onClick: handleViewLog,
      link: true,
      tooltip: getI18nValue('violationManagement.log')
    }
  ]
})

//解除禁言
function handleLiftBan(row: any) {
  dialogRelieveMethods.setIsVisible(true)
  userDetailsLog.value = row.imUserViolationsLog
  userDetailsLog.value.banRemark = ''
  title.value = getI18nValue('violationManagement.unblock')
}
//解除封号
function handleReleaseSeal(row: any) {
  dialogRelieveMethods.setIsVisible(true)
  userDetailsLog.value = row.imUserViolationsLog
  userDetailsLog.value.banRemark = ''
  title.value = getI18nValue('violationManagement.liftBan')
}

//延期
function handleDelay(row: any) {
  dialogProlongMethods.setIsVisible(true)
  userDetailsLog.value = row.imUserViolationsLog
  userDetailsLog.value.violatingContent = null
}

/**
 * 解除禁言/封号
 */
const handleConfirm = async () => {
  try {
    dialogRelieveMethods.setConfirmLoading(true)
    await getUserRelieveUpdateById(userDetailsLog.value).send()
    tableMethods.load()
    dialogRelieveMethods.setIsVisible(false)
  } finally {
    dialogRelieveMethods.setConfirmLoading(false)
  }
}

/**
 * 延期
 */
const handleProlongConfirm = async () => {
  try {
    dialogProlongMethods.setConfirmLoading(true)
    userDetailsLog.value.postpone = userDetailsLog.value.postpone + userDetailsLog.value.number
    await getUserUpdateById(userDetailsLog.value).send()
    tableMethods.load()
    dialogProlongMethods.setIsVisible(false)
  } finally {
    dialogProlongMethods.setConfirmLoading(false)
  }
}

//查看日志
async function handleViewLog(row: ImViolationsTypeLogList) {
  logList.value = []
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('violationManagement.log')
  let { data } = await getUserImViolationTypeList({ userId: row.userId }).send()
  logList.value = data
}

//查看违规日志
function handleViolatingContent(row: string) {
  violatingContentView.value = ''
  dialogViolatingContentMethods.setIsVisible(true)
  violatingContentView.value = row
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
function changeStatus(row: UserInfoStatusType) {
  if (Object.keys(row).length == 0) return
  let status = row.sensitiveStatus == +'1' ? '0' : '1'
  let msg = status == '0' ? 'msg.disableConfirm' : 'msg.enableConfirm'
  let resMsg = status == '0' ? 'msg.disableSuccess' : 'msg.enableSuccess'
  messageBox.MessageBox({
    message: getI18nValue(msg),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await getUserChangeStatus({ id: row.id, userId: row.userId, sensitiveStatus: +status }).send()
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
</script>
<style lang="scss" scoped></style>
