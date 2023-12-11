<template>
  <!--主页-->
  <MSTable @register="tableRegister">
    <template #sensitiveStatus="{ row }">
      <div>
        <el-switch
          v-if="hasPermission('im/groupManagement/changeStatus')"
          :model-value="row.sensitiveStatus"
          :activeValue="1"
          :inactiveValue="0"
          @change="changeStatus(row)"
        ></el-switch>
        <div v-else>{{ getStatus(row.sensitiveStatus) }}</div>
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleBatches" icon="Plus" type="primary">{{ getI18nValue('groupManagement.viewHistoricalMessages') }}</ms-button>
    </template>
  </MSTable>
  <!-- 查看群组信息-->
  <MSDialog @register="dialogRegister" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1">
        <template #userTable="{}">
          <MSTable @register="tableUserRegister"> </MSTable>
        </template>
      </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
  <!-- 申请管理 --->
  <MSDialog @register="dialogApplyRegister" :title="title">
    <div class="flex">
      <MSTable @register="tableApplyRegister">
        <template #toolbar>
          <ms-button @click="handleAdd" icon="Plus" type="primary">{{ getI18nValue('btn.add') }}</ms-button>
        </template>
      </MSTable>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
  <!--申请详情 -->
  <MSDialog @register="dialogFromApplyRegister" @ok="handleConfirm" :title="detailsTitle">
    <div class="flex">
      <MSForm @register="formApplyRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
    <el-divider />
    <el-form :model="dispatchForm" label-width="13%" v-if="dispatchForm.id != ''">
      <el-form-item :label="getI18nValue('groupManagement.findingsAudit')"> </el-form-item>
      <el-form-item :label="getI18nValue('groupManagement.reviewStatus')">
        <div v-if="dispatchForm.status == 2">{{ getI18nValue('groupManagement.pendingReview') }}</div>
        <div v-if="dispatchForm.status == 1" class="text-lime-500">{{ getI18nValue('groupManagement.adopt') }}</div>
        <div v-if="dispatchForm.status == 0" class="text-red-500">{{ getI18nValue('groupManagement.notPassed') }}</div>
      </el-form-item>
      <el-form-item :label="getI18nValue('groupManagement.byReason')" v-if="dispatchForm.status != 2">
        {{ dispatchForm.reason }}
      </el-form-item>
      <el-form-item :label="getI18nValue('groupManagement.authorizationCode')" v-if="dispatchForm.status == 1">
        <div class="text-blue-500 cursor-pointer" @click="handleLicenceCode(dispatchForm)">**************</div>
      </el-form-item>
    </el-form>
  </MSDialog>
  <!--违规Form表单-->
  <MSDialog @register="dialogViolationRegister" @ok="handleViolationConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formViolationRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>

  <!--确认密码-->
  <MSDialog @register="dialogPasswordRegister" @ok="handlePasswordConfirm" :title="getI18nValue('groupManagement.obtainAuthorizationCode')">
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('groupManagement.operationInvolves') }}</p>
    <el-form :model="passwordStaffForm" label-width="120px">
      <el-form-item :label="getI18nValue('groupManagement.password')">
        <el-input v-model="passwordStaffForm.passwordStaff" :placeholder="getI18nValue('groupManagement.pleaseEnterPassword')" />
      </el-form-item>
    </el-form>
  </MSDialog>

  <!--确认授权码-->
  <MSDialog
    @register="dialogAuthorizationCodeRegister"
    @ok="handleAuthorizationCodeConfirm"
    :title="getI18nValue('groupManagement.verificationAuthorizationCode')"
  >
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('groupManagement.featureInvolves') }}</p>
    <el-form :model="authorizationCodeForm" label-width="120px">
      <el-form-item :label="getI18nValue('groupManagement.authorizationCode')">
        <el-input v-model="authorizationCodeForm.authorizationCode" :placeholder="getI18nValue('groupManagement.enterAuthorizationCode')" />
      </el-form-item>
    </el-form>
  </MSDialog>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import {
  getGroupManagementPageList,
  getchangeStatus,
  getUserList,
  getApplyPage,
  getApplySave,
  getGroupViolationsSave,
  getPasswordStaff,
  getAuthorizationCode,
  getGroupMessageList
} from '@/apis/imOperation/groupManagement/index'
import {
  tableColumns,
  formColumns,
  searchColumns,
  tableUserColumns,
  searchUserColumns,
  tableApplyColumns,
  formColumnsViolation,
  formApplyColums
} from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { router } from '@/router/index'
import {
  GroupManagementPageListType,
  GroupManagementQuery,
  ImUserGroupAuthorisationPage,
  ImUserGroupAuthorisation,
  GroupManageUserPage,
  ImGroupViolationsLogList
} from '@/apis/imOperation/groupManagement/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')
const detailsTitle = ref<string>('')
const createGroup = ref({ groupId: '', groupName: '' })
const dispatchForm = ref({ status: 1, reason: '', id: '' })
const passwordStaffForm = ref({})
const authorizationCodeForm = ref({})
//群组列表
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getGroupManagementPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'View',
      onClick: handleView,
      link: true,
      tooltip: getI18nValue('groupManagement.check')
    },
    {
      icon: 'Operation',
      onClick: handleApply,
      link: true,
      tooltip: getI18nValue('groupManagement.application')
    },
    {
      icon: 'Document',
      onClick: handleViewAuthorization,
      link: true,
      tooltip: getI18nValue('groupManagement.historicalNews')
    },
    {
      icon: 'Setting',
      onClick: handleViolation,
      link: true,
      tooltip: getI18nValue('groupManagement.violationRegulations'),
      auth: 'im/groupManagement/userViolationsSave',
      ifShow: (row: any) => {
        if (row.blockedStatus) {
          return false
        }
        return true
      }
    }
  ]
})
//用户列表
const { register: tableUserRegister, methods: tableUserMethods } = useTable({
  tableColumns: tableUserColumns,
  api: getUserList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchUserColumns,
  onBeforeLoad(res: any) {
    return { ...res, groupId: createGroup.value.groupId }
  }
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
      tooltip: getI18nValue('groupManagement.viewDetails'),
      auth: 'im/groupManagement/page'
    },
    {
      icon: 'ChatLineRound',
      onClick: handleLicenceCode,
      link: true,
      tooltip: getI18nValue('groupManagement.viewAuthorizationCode'),
      auth: 'im/groupManagement/page',
      ifShow: (row: any) => {
        if (row.status == 1) {
          return true
        }
        return false
      }
    }
  ],
  onBeforeLoad(res: any) {
    return { ...res, groupId: createGroup.value.groupId }
  }
})

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '15%'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({})
const { register: dialogApplyRegister, methods: dialogApplyMethods } = useDialog({
  width: '70%'
})
const { register: formApplyRegister, methods: formApplyMethods } = useForm({
  formColumns: formApplyColums,
  labelWidth: '15%'
})
const { register: dialogFromApplyRegister, methods: dialogFromApplyMethods } = useDialog({
  width: '60%'
})
const { register: formViolationRegister, methods: formViolationMethods } = useForm({
  formColumns: formColumnsViolation,
  labelWidth: '15%'
})
const { register: dialogViolationRegister, methods: dialogViolationMethods } = useDialog({})

//查看和授权码
const { register: dialogPasswordRegister, methods: dialogPasswordMethods } = useDialog({})
const { register: dialogAuthorizationCodeRegister, methods: dialogAuthorizationCodeMethods } = useDialog({})

/**
 * 批量申请查看历史消息
 */
async function handleBatches() {
  createGroup.value = { groupId: '', groupName: '' }
  dialogApplyMethods.setIsVisible(true)
  title.value = getI18nValue('groupManagement.applyForAuthorization')
  let data = await tableMethods.getSelectionRows()
  data.forEach((t: any) => {
    if (createGroup.value.groupId) {
      createGroup.value.groupId = createGroup.value.groupId + ',' + t.groupId
      createGroup.value.groupName = createGroup.value.groupName + ',' + t.name
    } else {
      createGroup.value.groupId = t.groupId
      createGroup.value.groupName = t.name
    }
  })
}

/**
 * 申请按钮
 */
function handleApply(row: GroupManagementPageListType) {
  createGroup.value.groupId = row.groupId
  createGroup.value.groupName = row.name
  dialogApplyMethods.setIsVisible(true)
  title.value = getI18nValue('groupManagement.applyForAuthorization')
}

/**
 * 新增申请
 */
function handleAdd() {
  if (createGroup.value.groupId) {
    dispatchForm.value = { id: '' }
    dialogFromApplyMethods.setIsVisible(true)
    detailsTitle.value = getI18nValue('groupManagement.newApplication')
    formApplyMethods.setValue({ name: createGroup.value.groupName })
    dialogFromApplyMethods.setProps({
      isConfirm: true
    })
  } else {
    message.warning({
      message: getI18nValue('groupManagement.noGroupSelected')
    })
  }
}

/**
 * 申请详情
 */
async function handleLicenceDetails(row: ImUserGroupAuthorisation) {
  dialogFromApplyMethods.setIsVisible(true)
  detailsTitle.value = getI18nValue('groupManagement.applicationDetails')
  dispatchForm.value = row
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

/**
 * 申请详情保存
 */
const handleConfirm = async () => {
  try {
    await formApplyMethods.validate()
    dialogFromApplyMethods.setConfirmLoading(true)
    const data: any = await formApplyMethods.getValue()
    data.groupId = createGroup.value.groupId
    await getApplySave(data).send()
    tableApplyMethods.load()
    dialogFromApplyMethods.setIsVisible(false)
  } finally {
    dialogFromApplyMethods.setConfirmLoading(false)
  }
}

/**
 * 查看授权码
 */
function handleLicenceCode(row: any) {
  //先打开密码
  dialogPasswordMethods.setIsVisible(true)
  dispatchForm.value = row
}

//验证密码
const handlePasswordConfirm = async () => {
  try {
    dialogPasswordMethods.setConfirmLoading(true)
    await getPasswordStaff({ password: passwordStaffForm.value.passwordStaff }).send()
    dialogPasswordMethods.setIsVisible(false)
    haneldAuthorizationCode(dispatchForm.value.id)
  } finally {
    dialogPasswordMethods.setConfirmLoading(false)
  }
}

//显示授权码
function haneldAuthorizationCode(row: string) {
  ElMessageBox.alert(row, getI18nValue('groupManagement.authorizationCode'), {
    confirmButtonText: 'OK'
  })
  passwordStaffForm.value.passwordStaff = ''
}

/**
 * 查看历史消息
 */
function handleViewAuthorization(row: ImUserGroupAuthorisation) {
  createGroup.value = { groupId: '', groupName: '' }
  dialogAuthorizationCodeMethods.setIsVisible(true)
  createGroup.value.groupId = row.groupId
}

//验证授权码
const handleAuthorizationCodeConfirm = async () => {
  try {
    dialogAuthorizationCodeMethods.setConfirmLoading(true)
    await getAuthorizationCode({ id: authorizationCodeForm.value.authorizationCode, groupId: createGroup.value.groupId }).send()
    tableApplyMethods.load()
    dialogAuthorizationCodeMethods.setIsVisible(false)
    let data = await getGroupMessageList({ localDate: '2023-12-3', groupId: createGroup.value.groupId }).send() //历史消息
    console.log(data)
    authorizationCodeForm.value.authorizationCode = ''
  } finally {
    dialogAuthorizationCodeMethods.setConfirmLoading(false)
  }
}

/**
 * 打开违规表单
 */
function handleViolation(row: ImGroupViolationsLogList) {
  createGroup.value.groupId = row.groupId
  createGroup.value.groupName = row.name
  dialogViolationMethods.setIsVisible(true)
  title.value = getI18nValue('groupManagement.createViolationInformation')
}

/**
 * 群组详情
 */
function handleView(row: GroupManagementPageListType) {
  createGroup.value = row
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('groupManagement.details')
  formMethods.setValue(row)
}

/**
 * 违规form表单保存
 */
const handleViolationConfirm = async () => {
  try {
    await formViolationMethods.validate()
    dialogViolationMethods.setConfirmLoading(true)
    const data: any = await formViolationMethods.getValue()
    data.groupId = createGroup.value.groupId
    data.groupName = createGroup.value.groupName
    await getGroupViolationsSave(data).send()
    tableMethods.load()
    dialogViolationMethods.setIsVisible(false)
  } finally {
    dialogViolationMethods.setConfirmLoading(false)
  }
}

/** 启用/禁用 */
function changeStatus(row: GroupManagementPageListType) {
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
          row.sensitiveStatus = +status
          await getchangeStatus(row).send()
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

function getStatus(sensitiveStatus: string) {
  if (!sensitiveStatus) {
    return ''
  }
  if (sensitiveStatus == '1') return getI18nValue('common.enable')
  else return getI18nValue('common.disable')
}
</script>
