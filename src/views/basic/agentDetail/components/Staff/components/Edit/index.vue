<template>
  <MSDialog @register="dialogRegister" :title="title">
    <MSForm @register="formRegister"></MSForm>
    <template #footer>
      <ms-button @click="handleClose">{{ getI18nValue('btn.cancel') }} </ms-button>
      <ms-button type="primary" @click="handleConfirm">{{ getI18nValue('btn.confirm') }}</ms-button>
    </template>
  </MSDialog>
</template>
<script setup lang="ts">
import { useForm, MSForm } from '@/components/ms-form'
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getI18nValue } from '@/utils/i18n/index'
import { formColumns } from './index'
import { staffEmailMobileEdit } from '@/apis/basic/staff'
const props = defineProps<{
  data: {
    staffId: number
    staffCode: string
    type: number //1修改手机号码 2 修改邮箱
    api: Function
  }
  modelValue: boolean
}>()

const title = ref('')
const emits = defineEmits(['update:modelValue'])
const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelPosition: 'top'
})
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  isCancel: false,
  isConfirm: false,
  width: '500px',
  onClose: handleClose
})
onMounted(async () => {
  title.value = props.data.type == 1 ? getI18nValue('staff.editMobile') : getI18nValue('staff.editEmail')
  dialogMethods.setIsVisible(true)
  formMethods.setValue({ staffId: props.data.staffId, staffCode: props.data.staffCode })
  if (props.data.type == 1) {
    await formMethods.updateFormColumn({ prop: 'email', ifShow: false })
  } else {
    await formMethods.updateFormColumn({ prop: 'mobileNum', ifShow: false })
  }
})

function handleClose() {
  emits('update:modelValue', false)
}
async function handleConfirm() {
  await formMethods.validate()
  const data = await formMethods.getValue()
  handleClose()
  const message = props.data.type == 1 ? getI18nValue('msg.phoneConfirm') : getI18nValue('msg.emailConfirm')
  new useMessageBox().MessageBox({
    message,
    beforeClose: async (action, instance, done) => {
      if (action == 'confirm') {
        try {
          instance.confirmButtonLoading = true
          await staffEmailMobileEdit(data).send()
          await props.data.api()
          done()
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
