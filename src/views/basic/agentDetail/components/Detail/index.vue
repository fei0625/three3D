<template>
  <div class="flex w-full">
    <MSForm @register="formRegister" class="flex-1"> </MSForm>
    <div class="w-[15%]"></div>
  </div>
  <section class="flex justify-center">
    <ms-button type="primary" @click="handleConfirm" :loading="isLoading">{{ getI18nValue('agentDetail.updateInformation') }} </ms-button>
  </section>
</template>
<script setup lang="ts">
import { useForm, MSForm } from '@/components/ms-form'
import { formColumns } from './index'
import { getI18nValue } from '@/utils/i18n/index'

import { getAgentDetail, agentUpdateById } from '@/apis/basic/agent'
import { AgentSaveType } from '@/apis/basic/agent/type'
const isLoading = ref(false)

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '30%',
  inline: true,
  colProps: { xs: 24, sm: 12, md: 12, lg: 12, xl: 12 },
  gutter: 20
})

const route = useRoute()

async function geAgent() {
  const { data } = await getAgentDetail(route.query.agentId as unknown as number).send()
  formMethods.setValue(data)
}

onMounted(async () => {
  await geAgent()
})
/**
 * 保存
 */
const handleConfirm = debounce(async () => {
  try {
    await formMethods.validate()
    isLoading.value = true
    const data: AgentSaveType = await formMethods.getValue()
    await agentUpdateById(data).send()
    await geAgent()
    new useMessage().success({
      message: getI18nValue('msg.saveSuccess')
    })
  } finally {
    isLoading.value = false
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-form) {
  .el-form-item {
    width: 100%;
  }
}
</style>
