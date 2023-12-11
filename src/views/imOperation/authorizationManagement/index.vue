<template>
  <MSTable @register="tableRegister"> </MSTable>
  <MSDialog @register="dialogRegister" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
    <div v-if="hideStatus != 2">
      <el-divider />
      <div>
        <el-form :model="dispatchForm" label-width="13%">
          <el-form-item :label="getI18nValue('authorizationManagement.findingsAudit')"> </el-form-item>
          <el-form-item :label="getI18nValue('authorizationManagement.reviewStatus')">
            <div v-if="dispatchForm.status == 1" class="text-lime-500">{{ getI18nValue('authorizationManagement.adopt') }}</div>
            <div v-if="dispatchForm.status == 0" class="text-red-500">{{ getI18nValue('authorizationManagement.notPassed') }}</div>
          </el-form-item>
          <el-form-item :label="getI18nValue('authorizationManagement.byReason')">
            {{ dispatchForm.reason }}
          </el-form-item>
          <el-form-item :label="getI18nValue('authorizationManagement.authorizationCode')" v-if="dispatchForm.status == 1">
            <div class="text-blue-500 cursor-pointer" @click="handleLicenceCode(dispatchForm)">**************</div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <div v-if="hideStatus == 2">
        <el-button type="primary" @click="handlePassedFailed(1)">{{ getI18nValue('authorizationManagement.adopt') }}</el-button>
        <el-button type="primary" @click="handlePassedFailed(0)">{{ getI18nValue('authorizationManagement.notPassed') }}</el-button>
      </div>
    </template>
  </MSDialog>

  <MSDialog @register="dialogRemarkRegister" :title="passFailedTitle" @ok="handleConfirm">
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('authorizationManagement.enterReason') }}</p>
    <el-form :model="patchForm" label-width="120px">
      <el-form-item :label="getI18nValue('authorizationManagement.reason')">
        <el-input v-model="patchForm.dispatch" :rows="2" type="textarea" :placeholder="getI18nValue('authorizationManagement.enterReason')" />
      </el-form-item>
    </el-form>
  </MSDialog>

  <!--确认密码-->
  <MSDialog @register="dialogPasswordRegister" @ok="handlePasswordConfirm" :title="getI18nValue('authorizationManagement.verificationAuthorizationCode')">
    <p class="pl-[59px] pb-6" style="font-size: 15px">{{ getI18nValue('authorizationManagement.operationInvolves') }}</p>
    <el-form :model="passwordStaffForm" label-width="120px">
      <el-form-item :label="getI18nValue('authorizationManagement.password')">
        <el-input v-model="passwordStaffForm.passwordStaff" :placeholder="getI18nValue('authorizationManagement.enterPassword')" />
      </el-form-item>
    </el-form>
  </MSDialog>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getImApplyPageList, getImApplyPass, getPasswordStaff } from '@/apis/imOperation/authorizationManagement/index'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { router } from '@/router/index'
import { ImApplyPageListType } from '@/apis/imOperation/authorizationManagement/type'

const message = new useMessage()
const messageBox = new useMessageBox()
const title = ref<string>('')
const passFailedTitle = ref('')
const patchForm = ref({})
const status = ref(0)
const hideStatus = ref(0)
const dispatchForm = ref({ status: 1, reason: '', id: '' })
const passwordStaffForm = ref({})
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getImApplyPageList,
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
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  isCancel: false,
  isConfirm: false
})
//通过/未通过
const { register: dialogRemarkRegister, methods: dialogRemarkMethods } = useDialog({})

const { register: dialogPasswordRegister, methods: dialogPasswordMethods } = useDialog({})

/** 详情 */
function handleView(row: ImApplyPageListType) {
  hideStatus.value = row.status
  dispatchForm.value = row
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('authorizationManagement.details')
  formMethods.setValue(row)
}

//通过/未通过
function handlePassedFailed(row: any) {
  dialogRemarkMethods.setIsVisible(true)
  status.value = row
  if (row == 1) {
    passFailedTitle.value = getI18nValue('authorizationManagement.reasonsAdoption')
  } else {
    passFailedTitle.value = getI18nValue('authorizationManagement.reasonsFailure')
  }
}
const handleConfirm = async () => {
  try {
    await formMethods.validate()
    dialogRemarkMethods.setConfirmLoading(true)
    const data: any = await formMethods.getValue()
    data.reason = patchForm.value.dispatch
    data.status = status.value
    await getImApplyPass(data).send()
    tableMethods.load()
    patchForm.value.dispatch = ''
    dialogRemarkMethods.setIsVisible(false)
    dialogMethods.setIsVisible(false)
  } finally {
    dialogRemarkMethods.setConfirmLoading(false)
    dialogMethods.setConfirmLoading(false)
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
  ElMessageBox.alert(row, getI18nValue('authorizationManagement.authorizationCode'), {
    confirmButtonText: 'OK'
  })
  passwordStaffForm.value.passwordStaff = ''
}
</script>
