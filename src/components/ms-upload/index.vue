<template>
  <el-upload
    :action="uploadUrl"
    :headers="{ token: userStore.loginToken, lang: globalStore.global.language }"
    :on-success="handleAvatarSuccess"
    :on-error="handleAvatarError"
    :data="props.data"
    :before-upload="beforeAvatarUpload"
    :show-file-list="false"
    v-if="isHide"
    class="inline-block align-bottom"
  >
    <ms-button icon="Upload" type="primary"
      ><slot> {{ getI18nValue('btn.upload') }}</slot></ms-button
    >
  </el-upload>
</template>
<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n'
import { useUserStore } from '@/stores/modules/user'
import { useGlobalStore } from '@/stores/modules/global'
import { UploadRawFile } from 'element-plus'
import { hasPermission } from '@/utils/permission'

const userStore = useUserStore()
const globalStore = useGlobalStore()

interface Props {
  accept?: string //文件类型限制
  action: string //上传路径
  data?: Record<string, unknown> //额外参数
  auth?: string //权限
  successTip?: boolean //是否需要上传成功提示
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'xls,xlsx',
  successTip: true
})
const emits = defineEmits(['success'])
const isHide = ref(true)

const message = new useMessage()
const { VITE_APP_URL } = getAppEnvConfig()
const uploadUrl = computed(() => VITE_APP_URL + props.action)
function hasShow() {
  if (props.auth) {
    isHide.value = false
    if (hasPermission(props.auth)) {
      isHide.value = true
    }
  }
}
onMounted(() => {
  hasShow()
})
function handleAvatarSuccess(res: any) {
  if (res?.code == 0) {
    if (props.successTip) {
      message.success({
        message: getI18nValue('msg.uploadedSuccess')
      })
    }
    emits('success', res.data)
  } else {
    message.error({
      message: res.msg
    })
  }
}

function handleAvatarError() {
  message.error({
    message: getI18nValue('msg.uploadError')
  })
}
function beforeAvatarUpload(rawFile: UploadRawFile) {
  if (props.accept) {
    const name = rawFile.name.slice(rawFile.name.lastIndexOf('.') + 1)
    const isType = props.accept.split(',').includes(name)
    if (!isType) {
      message.error({
        message: getI18nValue('msg.fileFormatError') + ' ' + props.accept.replace(',', ' or ')
      })
      return false
    }
  }

  return true
}
</script>
