<template>
  <el-form :model="userInfo" ref="formRef" :rules="rules" size="default">
    <el-form-item prop="staffCode">
      <el-input v-model="userInfo.staffCode" clearable :placeholder="getI18nValue('login.staffCode')" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="userInfo.password" type="password" show-password clearable :placeholder="getI18nValue('login.codeCase')" maxlength="32" />
    </el-form-item>

    <el-form-item>
      <ms-button type="primary" @click="handleSubmit" class="w-full mt-5" :loading="isLoading">{{ getI18nValue('login.login') }}</ms-button>
    </el-form-item>
  </el-form>
  <!-- 密码修改 -->
  <ms-reset-password v-model="isVisible" :data="resetPasswordData" v-if="isVisible"></ms-reset-password>
  <ms-verifition mode="pop" captchaType="blockPuzzle" :imgSize="{ width: '400px', height: '200px' }" ref="verify" @success="handleSuccess"></ms-verifition>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { getI18nValue } from '@/utils/i18n'
import { useUserStore } from '@/stores/modules/user'
import { LoginGoParamsType } from '@/apis/login/type'
import { editPassword } from '@/apis/common'
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const userInfo = reactive<LoginGoParamsType>({
  staffCode: 'admin',
  password: 'QAZ_mesh_!@##',
  captchaVerification: ''
})
const message = new useMessage()
const isLoading = ref(false)
const isVisible = ref(false)
const verify = ref()
const rules = reactive<FormRules>({
  staffCode: [
    {
      required: true,
      message: getI18nValue('login.staffCode')
    }
  ],
  password: [
    {
      required: true,
      message: getI18nValue('login.codeCase')
    }
  ],
  imageCode: [
    {
      required: true,
      message: getI18nValue('login.imageCode')
    }
  ]
})

async function handleSubmit() {
  await unref(formRef)?.validate()
  verify.value.show()
}
const handleSuccess = async (res: { captchaVerification: string }) => {
  userInfo.captchaVerification = res.captchaVerification
  try {
    isLoading.value = true
    await userStore.login(userInfo)
  } catch (error: any) {
    const { msg, code } = error
    switch (code) {
      case 40002:
        new useMessageBox().MessageBox({
          message: msg,
          type: 'error',
          beforeClose: (action, _instance, done) => {
            if (action == 'confirm') {
              resetPasswordData.params.staffCode = userInfo.staffCode
              resetPasswordData.staffCode = userInfo.staffCode
              isVisible.value = true
            }
            done()
          }
        })
        break
      case 1:
        message.error({
          message: msg
        })
        break
    }
  } finally {
    isLoading.value = false
  }
}

const resetPasswordData = reactive({
  params: {
    staffCode: userInfo.staffCode
  },
  api: editPassword,
  staffCode: userInfo.staffCode
})
</script>
