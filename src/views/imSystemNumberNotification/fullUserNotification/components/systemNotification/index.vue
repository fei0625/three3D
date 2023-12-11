<script setup lang="ts">
import { useForm, MSForm } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { userGroupTree, pushNotification } from '@/apis/imSystemNumberNotification/notificationHistory'
import { NotificationHistory } from '@/apis/imSystemNumberNotification/notificationHistory/type'

const arr = [
  getI18nValue('fullUserNotification.tips6'),
  getI18nValue('fullUserNotification.tips7'),
  getI18nValue('fullUserNotification.tips8'),
  getI18nValue('fullUserNotification.tips9')
]
const { register: formRegister, methods: formMethods } = useForm({
  formColumns: [
    {
      label: getI18nValue('fullUserNotification.pushGroup'),
      prop: 'userRange',
      component: 'RadioGroup',
      required: true,
      defaultValue: 1,
      componentProps: {
        option: [
          {
            label: getI18nValue('fullUserNotification.allUsers'),
            value: 1
          },
          {
            label: getI18nValue('fullUserNotification.userGroup'),
            value: 2
          }
        ]
      }
    },
    {
      label: getI18nValue('fullUserNotification.userGroup'),
      prop: 'groupId',
      component: 'ApiSelectTree',
      required: true,
      ifShow: ({ model }: { model: any }) => {
        return model.userRange == 2
      },
      componentProps: {
        api: userGroupTree,
        clearable: true,
        multiple: true,
        filterable: true,
        params: {},
        props: {
          label: 'groupName',
          children: 'children',
          value: 'id'
        }
      }
    },
    {
      label: getI18nValue('fullUserNotification.pushModel'),
      prop: 'pushModel',
      component: 'RadioGroup',
      required: true,
      defaultValue: 3,
      componentProps: {
        option: [
          { label: getI18nValue('fullUserNotification.all'), value: 3 },
          { label: 'Android', value: 2 },
          { label: 'IOS', value: 1 }
        ]
      }
    },
    {
      label: getI18nValue('fullUserNotification.title'),
      prop: 'title',
      component: 'Input',
      required: true
    },
    {
      label: getI18nValue('fullUserNotification.notificationContent'),
      prop: 'pushContent',
      component: 'InputTextArea',
      required: true,
      componentProps: {
        maxlength: 220,
        showWordLimit: true,
        placeholder: getI18nValue('fullUserNotification.pleaseEnterNotificationContent'),
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

    data.pushType = 1
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
            getI18nValue('btn.immediatePush')
          }}</ms-button>
        </div>
      </section>
    </article>
    <article class="flex-1 flex justify-center items-start">
      <img src="@/assets/systemNumberNotification/systemNotification.png" alt="" />
    </article>
  </main>
</template>
