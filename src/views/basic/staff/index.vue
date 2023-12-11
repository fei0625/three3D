<template>
  <MSTable @register="tableRegister">
    <template #status="{ row }">
      <div>
        <el-switch
          v-if="hasPermission('sys/staff/changeStatus')"
          :model-value="row.status"
          activeValue="1"
          inactiveValue="0"
          @change="changeStatus(row)"
          :disabled="row.staffId == -1"
        ></el-switch>
        <div v-else>{{ getStatus(row.status) }}</div>
      </div>
    </template>
    <template #mobileNum="{ row }">
      <div class="text-color cursor-pointer text-[--ms-color]" @click="handleEditUser(row, 1)">
        {{ hideMobile(row.mobileNum) }}
      </div>
    </template>
    <template #email="{ row }">
      <div class="text-color cursor-pointer text-[--ms-color]" @click="handleEditUser(row, 2)">
        {{ hideEMail(row.email) }}
      </div>
    </template>
    <template #toolbar>
      <ms-button @click="handleAdd" icon="Plus" type="primary" auth="sys/staff/save">{{ getI18nValue('btn.add') }}</ms-button>
    </template>
  </MSTable>

  <MSDialog @register="dialogRegister" @ok="handleConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1"> </MSForm>
      <div class="w-[12%]"></div>
    </div>
  </MSDialog>
  <ms-reset-password
    v-model="isVisibleResertPassword"
    :title="getI18nValue('staff.resetCodeCase')"
    :data="resetPasswordData"
    v-if="isVisibleResertPassword"
  ></ms-reset-password>

  <Edit v-model="isVisibleEmail" :data="resetEmailData" v-if="isVisibleEmail"></Edit>
</template>
<script setup lang="ts">
import { useTable, MSTable } from '@/components/ms-table'
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getStaffPageList, staffSave, staffDel, staffRestPassword, staffChangeStatus } from '@/apis/basic/staff'
import { tableColumns, formColumns, searchColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'
import { hasPermission } from '@/utils/permission'
import { hideMobile, hideEMail } from '@/utils/common'
import { StaffSaveType, StaffType } from '@/apis/basic/staff/type'
import Edit from './components/Edit/index.vue'
const message = new useMessage()
const messageBox = new useMessageBox()
const isVisibleResertPassword = ref<boolean>(false)
const isVisibleEmail = ref<boolean>(false)

const title = ref<string>('')
const resetPasswordData = reactive({
  params: {
    staffId: 0
  },
  api: staffRestPassword,
  staffCode: '',
  originalPassword: false,
  title: getI18nValue('staff.resetCodeCase')
})
const { register: tableRegister, methods: tableMethods } = useTable({
  tableColumns: tableColumns,
  api: getStaffPageList,
  showPagination: true,
  isAutoHeight: true,
  searchColumns: searchColumns,
  actionColumn: [
    {
      icon: 'Edit',
      onClick: handleEdit,
      link: true,
      auth: 'sys/staff/save',
      tooltip: getI18nValue('btn.edit')
    },
    {
      icon: 'Delete',
      onClick: handleDelete,
      link: true,
      auth: 'sys/staff/remove',
      tooltip: getI18nValue('btn.del'),
      ifShow: (data: StaffType) => {
        if (data.status != '1') {
          return true
        }
        return false
      }
    },
    {
      icon: 'Lock',
      onClick: resetPassword,
      link: true,
      auth: 'sys/staff/restPwd',
      tooltip: getI18nValue('staff.resetCodeCase')
    }
  ]
})

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '15%'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({})
const resetEmailData = reactive({
  type: 0,
  staffId: 0,
  staffCode: '',
  api: tableMethods.load
})
/** 新增*/
function handleAdd() {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('staff.addStaffCode')
}

/**修改 */
async function handleEdit(row: StaffType) {
  dialogMethods.setIsVisible(true)
  title.value = getI18nValue('staff.editStaffCode')
  formMethods.setValue(row)
}

/** 删除*/
function handleDelete(row: StaffType) {
  messageBox.MessageBox({
    message: getI18nValue('msg.deleteConfirm'),
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await staffDel(row.staffId).send()
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
const handleConfirm = debounce(async () => {
  try {
    await formMethods.validate()
    dialogMethods.setConfirmLoading(true)
    const data: StaffSaveType = await formMethods.getValue()
    await staffSave(data).send()
    tableMethods.load()
    dialogMethods.setIsVisible(false)
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
})

/**
 * 重置密码
 */
function resetPassword(row: StaffType) {
  isVisibleResertPassword.value = true
  resetPasswordData.staffCode = row.staffCode
  resetPasswordData.params.staffId = row.staffId
}

function getStatus(status: string) {
  if (!status) {
    return ''
  }
  if (status == '1') return getI18nValue('common.enable')
  else return getI18nValue('common.disable')
}

/** 启用/禁用 */
function changeStatus(row: StaffType) {
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
          await staffChangeStatus({
            staffId: row.staffId,
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

//邮箱密码修改
function handleEditUser(row: StaffType, type: number) {
  isVisibleEmail.value = true
  resetEmailData.type = type
  resetEmailData.staffId = row.staffId
  resetEmailData.staffCode = row.staffCode
}
</script>
<style lang="scss" scoped></style>
