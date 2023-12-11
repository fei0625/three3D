<template>
  <MSDialog @register="dialogRegister" @ok="handleConfirm" :title="title">
    <div class="flex">
      <MSForm @register="formRegister" class="flex-1"></MSForm>
      <div class="w-[18%]"></div>
    </div>
  </MSDialog>
</template>
<script setup lang="ts">
import { MSForm, useForm } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'
import { useDialog, MSDialog } from '@/components/ms-dialog'

import { formColumns } from './index'

const props = defineProps<{
  data: {
    staffCode: string //用于检查密码
    params: any //更新密码需要携带的额外密码
    api: Function //接口
    originalPassword?: boolean //是否展示原始密码 true展示 false不展示
    title?: string //标题
  }
  modelValue: boolean
}>()

const title = ref('')
const emits = defineEmits(['update:modelValue'])
const { register: formRegister, methods: formMethods } = useForm({ formColumns, labelWidth: '30%' })
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  onClose: handleClose
})
onMounted(async () => {
  if (props.data.title) {
    title.value = props.data.title
  } else {
    title.value = getI18nValue('login.editCodeCase')
  }
  dialogMethods.setIsVisible(true)
  if (!(props.data.originalPassword ?? true)) {
    formMethods.updateFormColumn({ prop: 'originalPassword', ifShow: false })
  }
  formMethods.setValue({ staffCode: props.data.staffCode })
})

function handleClose() {
  emits('update:modelValue', false)
}
const handleConfirm = async () => {
  try {
    await formMethods.validate()
    dialogMethods.setConfirmLoading(true)
    const { password, originalPassword } = await formMethods.getValue()
    await props.data.api({ password, originalPassword, ...props.data.params }).send()
    handleClose()
  } finally {
    dialogMethods.setConfirmLoading(false)
  }
}
</script>
<style lang="scss" scoped></style>
