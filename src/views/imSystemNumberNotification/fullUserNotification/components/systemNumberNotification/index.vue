<script setup lang="ts">
import { useForm, MSForm } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { getSystemNumberList, pushNotification } from '@/apis/imSystemNumberNotification/notificationHistory'
import { NotificationHistory } from '@/apis/imSystemNumberNotification/notificationHistory/type'

const arr = [
  getI18nValue('fullUserNotification.tips1'),
  getI18nValue('fullUserNotification.tips2'),
  getI18nValue('fullUserNotification.tips3'),
  getI18nValue('fullUserNotification.tips4'),
  getI18nValue('fullUserNotification.tips5')
]
const { register: formRegister, methods: formMethods } = useForm({
  formColumns: [
    {
      label: getI18nValue('fullUserNotification.sendSystemNumber'),
      prop: 'imSystemNumberId',
      component: 'ApiSelect',
      componentProps: {
        api: getSystemNumberList,
        labelField: 'name',
        valueField: 'id',
        filterable: true
      },
      required: true
    },
    {
      label: getI18nValue('fullUserNotification.title'),
      prop: 'title',
      component: 'Input',
      required: true
    },
    {
      label: getI18nValue('fullUserNotification.chatScreenContent'),
      prop: 'pushContent',
      component: 'InputTextArea',
      required: true,
      componentProps: {
        maxlength: 220,
        showWordLimit: true,
        placeholder: getI18nValue('fullUserNotification.pleaseEnterBroadcastContent'),
        rows: 6
      }
    }
  ],
  labelWidth: '30%',
  labelPosition: 'left'
})
const confirmLoading = ref(false)
const message = new useMessage()
const handleConfirm = debounce(async () => {
  try {
    await formMethods.validate()
    confirmLoading.value = true
    const data = await formMethods.getValue()

    data.pushType = 2
    await pushNotification(data).send()

    message.success({
      message: getI18nValue('msg.pushSuccess')
    })
  } finally {
    confirmLoading.value = false
  }
})
</script>
<template>
  <main class="flex justify-between">
    <article class="flex-1">
      <section>
        <div v-for="(item, index) in arr" :key="index" class="flex items-center gap-x-2 mt-2 first:mt-0">
          <span class="inline-block w-3 h-3 rounded-full border border-[#414141] flex-shrink-0"></span>
          {{ item }}
        </div>
      </section>
      <section class="ml-5 mt-5">
        <div class="flex">
          <MSForm @register="formRegister" class="flex-1"> </MSForm>
          <div class="w-[20%]"></div>
        </div>

        <div class="text-center mt-5">
          <ms-button type="primary" @click="handleConfirm" :loading="confirmLoading" auth="imNotificationHistory/push">{{
            getI18nValue('btn.immediateBroadcast')
          }}</ms-button>
        </div>
      </section>
    </article>
    <article class="flex-1 flex justify-center items-start">
      <img src="@/assets/systemNumberNotification/systemNotification.png" alt="" />
    </article>
  </main>
</template>
