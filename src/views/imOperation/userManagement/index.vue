<template>
  <MSTable @register="tableRegister">
    <template #icon="{ row }">
      <div class="flex items-center">
        <el-image class="w-5 h-5" :src="row.icon">
          <template #error>
            <ms-icon icon="Picture" :size="20"></ms-icon>
          </template>
        </el-image>
      </div>
    </template>
    <template #online="{ row }">
      <div class="flex items-center">
        <span v-if="row.online == '1'" style="color: green">{{ getI18nValue('userManagement.online') }}</span>
        <span v-if="row.online == '0'" style="color: red">{{ getI18nValue('userManagement.offline') }}</span>
      </div>
    </template>
    <template #sensitiveStatus="{ row }">
      <div>
        <el-switch
          v-if="hasPermission('im/userManagement/changeStatus')"
          :model-value="row.sensitiveStatus"
          :activeValue="1"
          :inactiveValue="0"
          @change="changeStatus(row)"
        ></el-switch>
        <div v-else>{{ getStatus(row.sensitiveStatus) }}</div>
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary">{{ getI18nValue('userManagement.viewHistoricalMessages') }}</ms-button>
    </template>
  </MSTable>
  <!--查看-->
  <MSDialog @register="dialogRegister" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
  <!--修改密码--->
  <MSDialog @register="dialogPasswordRegister" @ok="handleConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formPasswordRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
  <!--违规--->
  <MSDialog @register="dialogViolationRegister" @ok="handleViolationConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formViolationRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
  <!--申请管理--->
  <MSDialog @register="dialogApplyRegister" :title="title">
    <div class="flex">
      <MSTable @register="tableApplyRegister">
        <template #toolbar>
          <ms-button @click="handleApplyAdd" icon="Plus" type="primary">{{ getI18nValue('btn.add') }}</ms-button>
        </template>
      </MSTable>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
  <!--新增申请/修改--->
  <MSDialog @register="dialogFormApplyRegister" @ok="handleApplyConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formApplyRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
    <el-divider />
    <el-form :model="form" label-width="13%" v-if="form.id != ''">
      <el-form-item :label="getI18nValue('userManagement.offline')"> </el-form-item>
      <el-form-item :label="getI18nValue('userManagement.offline')">
        <div v-if="form.status == 2">{{ getI18nValue('userManagement.pendingReview') }}</div>
        <div v-if="form.status == 1" class="text-lime-500">{{ getI18nValue('userManagement.adopt') }}</div>
        <div v-if="form.status == 0" class="text-red-500">{{ getI18nValue('userManagement.notPassed') }}</div>
      </el-form-item>
      <el-form-item :label="getI18nValue('userManagement.byReason')" v-if="form.status != 2">
        {{ form.reason }}
      </el-form-item>
      <el-form-item :label="getI18nValue('userManagement.authorizationCode')" v-if="form.status == 1">
        <div class="text-blue-500 cursor-pointer" @click="handleLicenceCode(form)">**************</div>
      </el-form-item>
    </el-form>
  </MSDialog>

  <!--确认密码-->
  <MSDialog @register="dialogUserPasswordRegister" @ok="handleUserPasswordConfirm" :title="getI18nValue('userManagement.obtainAuthorizationCode')">
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('userManagement.operationInvolves') }}</p>
    <el-form :model="passwordStaffForm" label-width="120px">
      <el-form-item :label="getI18nValue('userManagement.password')">
        <el-input v-model="passwordStaffForm.passwordStaff" :placeholder="getI18nValue('userManagement.pleaseEnterPassword')" />
      </el-form-item>
    </el-form>
  </MSDialog>

  <!--确认授权码-->
  <MSDialog
    @register="dialogUserAuthorizationCodeRegister"
    @ok="handleUserAuthorizationCodeConfirm"
    :title="getI18nValue('userManagement.verificationAuthorizationCode')"
  >
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('userManagement.featureInvolves') }}</p>
    <el-form :model="authorizationCodeForm" label-width="120px">
      <el-form-item :label="getI18nValue('userManagement.authorizationCode')">
        <el-input v-model="authorizationCodeForm.authorizationCode" :placeholder="getI18nValue('userManagement.enterAuthorizationCode')" />
      </el-form-item>
    </el-form>
  </MSDialog>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import {
  getUserInfoPageList,
  getChangeStatus,
  getUserInfoPassword,
  getUserViolationsSave,
  getPasswordStaff,
  getAuthorizationCode,
  getApplyPage,
  getApplySave,
  getUserMessageList
} from '@/apis/imOperation/userManagement/index'
import { tableColumns, formColumns, searchColumns, formPasswordColumns, formColumnsViolation, tableApplyColumns, formApplyColums } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { router } from '@/router/index'
import { UserInfoPageListType, UserInfoStatusType, UserInfoPasswordType, ImUserViolationsLogList } from '@/apis/imOperation/userManagement/type'
import { AgentType } from '@/apis/basic/agent/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')
const userSelect = ref({ userId: null, userName: '' })
const form = ref({ status: 1, reason: '', id: '' })
const passwordStaffForm = ref({})
const authorizationCodeForm = ref({})
//主页
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getUserInfoPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'Lock',
      onClick: handlePasswordView,
      link: true,
      tooltip: getI18nValue('userManagement.resetPassword'),
      auth: 'im/userManagement/getUserInfoPassword'
    },
    {
      icon: 'View',
      onClick: handleView,
      link: true,
      tooltip: getI18nValue('userManagement.view')
    },
    {
      icon: 'ChatDotRound',
      onClick: handleHistoricalNews,
      link: true,
      tooltip: getI18nValue('userManagement.historyMessages')
    },
    {
      icon: 'Files',
      onClick: handleApply,
      link: true,
      tooltip: getI18nValue('userManagement.application')
    },
    {
      icon: 'Setting',
      onClick: handleViolation,
      link: true,
      tooltip: getI18nValue('userManagement.violations'),
      auth: 'im/userManagement/userViolationsSave',
      ifShow: (row: any) => {
        if (row.blockedStatus) {
          return false
        }
        return true
      }
    }
  ],
  actionConfig: { width: 160 }
})
//申请列表
const { register: tableApplyRegister, methods: tableApplyMethods } = useTable({
  tableColumns: tableApplyColumns,
  api: getApplyPage,
  showPagination: true,
  isAutoHeight: true,
  actionColumn: [
    {
      icon: 'Search',
      onClick: handleLicenceDetails,
      link: true,
      tooltip: getI18nValue('userManagement.viewDetails')
    },
    {
      icon: 'ChatLineRound',
      onClick: handleLicenceCode,
      link: true,
      tooltip: getI18nValue('userManagement.viewLicenceCode'),
      ifShow: (row: any) => {
        if (row.status == 1) {
          return true
        }
        return false
      }
    }
  ]
})
//用户详情
const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '15%'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  isCancel: false,
  isConfirm: false
})
//修改密码框
const { register: formPasswordRegister, methods: formPasswordMethods } = useForm({
  formColumns: formPasswordColumns,
  labelWidth: '15%'
})
const { register: dialogPasswordRegister, methods: dialogPasswordMethods } = useDialog({})
//违规详情
const { register: formViolationRegister, methods: formViolationMethods } = useForm({
  formColumns: formColumnsViolation,
  labelWidth: '15%'
})
const { register: dialogViolationRegister, methods: dialogViolationMethods } = useDialog({})
//申请列表
const { register: dialogApplyRegister, methods: dialogApplyMethods } = useDialog({
  width: '70%'
})
//申请详情
const { register: formApplyRegister, methods: formApplyMethods } = useForm({
  formColumns: formApplyColums,
  labelWidth: '15%'
})
const { register: dialogFormApplyRegister, methods: dialogFromApplyMethods } = useDialog({
  width: '60%'
})

//查看和授权码
const { register: dialogUserPasswordRegister, methods: dialogUserPasswordMethods } = useDialog({})
const { register: dialogUserAuthorizationCodeRegister, methods: dialogUserAuthorizationCodeMethods } = useDialog({})

/**
 * 批量申请
 */
async function handleAdd() {
  dialogApplyMethods.setIsVisible(true)
  title.value = getI18nValue('userManagement.applicationList')
  let data = await tableMethods.getSelectionRows()
  data.forEach((t: any) => {
    if (userSelect.value.userId) {
      userSelect.value.userId = userSelect.value.userId + ',' + t.userId
      userSelect.value.userName = userSelect.value.userName + ',' + t.name
    } else {
      userSelect.value.userId = t.userId
      userSelect.value.userName = t.name
    }
  })
}

/**
 * 申请新增
 */
function handleApplyAdd() {
  if (userSelect.value.userId) {
    form.value = { id: '' }
    dialogFromApplyMethods.setIsVisible(true)
    title.value = getI18nValue('userManagement.newRequests')
    formApplyMethods.setValue({ name: userSelect.value.userName })
    dialogFromApplyMethods.setProps({
      isConfirm: true
    })
  } else {
    message.warning({
      message: getI18nValue('userManagement.unselectedUsers')
    })
  }
}

/**
 * 申请按钮
 */
function handleApply(row: any) {
  dialogApplyMethods.setIsVisible(true)
  title.value = getI18nValue('userManagement.applicationList')
  userSelect.value.userId = row.userId
  userSelect.value.userName = row.name
}

/**
 * 查看授权码
 */
function handleLicenceCode(row: any) {
  //先打开密码
  dialogUserPasswordMethods.setIsVisible(true)
  form.value = row
}

/**
 * 查看授权详情
 */
function handleLicenceDetails(row: any) {
  dialogFromApplyMethods.setIsVisible(true)
  title.value = getI18nValue('userManagement.applicationDetails')
  form.value = row
  form.value = row
  formApplyMethods.updateFormColumn([
    {
      prop: 'applyDuration',
      componentProps: {
        disabled: true
      }
    },
    {
      prop: 'applyProve',
      componentProps: {
        disabled: true
      }
    },
    {
      prop: 'applyRemark',
      componentProps: {
        disabled: true
      }
    }
  ])
  formApplyMethods.setValue(row)
  dialogFromApplyMethods.setProps({
    isConfirm: false
  })
}

//验证密码
const handleUserPasswordConfirm = async () => {
  try {
    dialogUserPasswordMethods.setConfirmLoading(true)
    await getPasswordStaff({ password: passwordStaffForm.value.passwordStaff }).send()
    dialogUserPasswordMethods.setIsVisible(false)
    haneldAuthorizationCode(form.value.id)
  } finally {
    dialogUserPasswordMethods.setConfirmLoading(false)
  }
}

//显示授权码
function haneldAuthorizationCode(row: string) {
  ElMessageBox.alert(row, getI18nValue('userManagement.authorizationCode'), {
    confirmButtonText: 'OK'
  })
  passwordStaffForm.value.passwordStaff = ''
}

/**
 * 用户详情信息
 */
function handleView(row: UserInfoPageListType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('userManagement.userDetails')
  formMethods.setValue(row)
}

/**
 * 重置密码
 */
function handlePasswordView(row: UserInfoPageListType) {
  dialogPasswordMethods.setIsVisible(true)
  title.value = getI18nValue('userManagement.resetPassword')
  formPasswordMethods.setValue(row)
}

/**
 * 密码保存
 */
const handleConfirm = async () => {
  try {
    await formPasswordMethods.validate()
    dialogPasswordMethods.setConfirmLoading(true)
    const data: UserInfoPasswordType = await formPasswordMethods.getValue()
    await getUserInfoPassword(data)
    tableMethods.load()
    dialogPasswordMethods.setIsVisible(false)
  } finally {
    dialogPasswordMethods.setConfirmLoading(false)
  }
}

/**
 * 历史消息
 */
function handleHistoricalNews(row: any) {
  dialogUserAuthorizationCodeMethods.setIsVisible(true)
  userSelect.value.userId = row.userId
  userSelect.value.userName = row.name
}

//验证授权码
const handleUserAuthorizationCodeConfirm = async () => {
  try {
    dialogUserAuthorizationCodeMethods.setConfirmLoading(true)
    await getAuthorizationCode({ id: authorizationCodeForm.value.authorizationCode, userId: userSelect.value.userId }).send()
    tableApplyMethods.load()
    dialogUserAuthorizationCodeMethods.setIsVisible(false)
    let data = await getUserMessageList({ localDate: '2023-12-3', formUserId: userSelect.value.userId }).send() //历史消息
    console.log(data)
    authorizationCodeForm.value.authorizationCode = ''
  } finally {
    dialogUserAuthorizationCodeMethods.setConfirmLoading(false)
  }
}

/**
 * 违规
 */
function handleViolation(row: any) {
  userSelect.value.userId = row.userId
  userSelect.value.userName = row.name
  dialogViolationMethods.setIsVisible(true)
  title.value = getI18nValue('userManagement.addViolationInformation')
}

/**
 * 保存申请授权信息
 */
const handleApplyConfirm = async () => {
  try {
    await formApplyMethods.validate()
    dialogFromApplyMethods.setConfirmLoading(true)
    const data: any = await formApplyMethods.getValue()
    data.userId = userSelect.value.userId
    await getApplySave(data).send()
    tableApplyMethods.load()
    dialogFromApplyMethods.setIsVisible(false)
  } finally {
    dialogFromApplyMethods.setConfirmLoading(false)
  }
}

/**
 * 违规保存
 */
const handleViolationConfirm = async () => {
  try {
    await formViolationMethods.validate()
    dialogViolationMethods.setConfirmLoading(true)
    const data: any = await formViolationMethods.getValue()
    data.userId = userSelect.value.userId
    data.userName = userSelect.value.userName
    await getUserViolationsSave(data).send()
    tableMethods.load()
    dialogViolationMethods.setIsVisible(false)
  } finally {
    dialogViolationMethods.setConfirmLoading(false)
  }
}

/**
 * 启用/禁用
 */
function changeStatus(row: UserInfoPageListType) {
  if (Object.keys(row).length == 0) return
  let status = row.sensitiveStatus == +'1' ? '0' : '1'
  let msg = status == '0' ? 'msg.disableConfirm' : 'msg.enableConfirm'
  let messages = status == '0' ? 'msg.disableSuccess' : 'msg.enableSuccess'
  messageBox.MessageBox({
    message: getI18nValue(msg),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await getChangeStatus({
            id: row.id,
            userId: row.userId,
            sensitiveStatus: +status
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
