<template>
  <main class="bg-[--ms-bg] p-5 rounded-lg">
    <section class="flex">
      <MSForm @register="formRegister" class="flex-1"> </MSForm>
      <div class="w-[20%]"></div>
    </section>
    <section class="flex justify-center">
      <ms-button type="primary" @click="handleConfirm" :loading="isLoading">{{ getI18nValue('btn.save') }} </ms-button>
    </section>
  </main>
</template>
<script setup lang="ts">
import { formColumns } from './index'
import { useForm, MSForm } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'
import { getsSystemConfiguration, systemConfigurationSave } from '@/apis/system/configuration'
import { SystemConfigType } from '@/apis/common/type'
import { useGlobalStore } from '@/stores/modules/global'
const isLoading = ref(false)
const msMessage = new useMessage()
const globalStore = useGlobalStore()

const { register: formRegister, methods: formMethods } = useForm({
  formColumns,
  labelWidth: '40%'
})
onMounted(() => {
  getSysConfig()
})

async function getSysConfig() {
  const { data } = await getsSystemConfiguration().send()
  formMethods.setValue(data)
}

/**
 * 保存
 */
const handleConfirm = debounce(async () => {
  await formMethods.validate()
  isLoading.value = true
  const data: SystemConfigType = await formMethods.getValue()
  try {
    await systemConfigurationSave(data).send()
    globalStore.systemConfig = data
    msMessage.success({
      message: getI18nValue('msg.saveSuccess')
    })
    getSysConfig()
  } finally {
    isLoading.value = false
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-input-number) {
  flex: 1;
}
</style>
