<template>
  <section :class="props.multiple ? 'flex flex-wrap gap-3' : ''">
    <template v-if="props.multiple">
      <div class="img relative" :class="props.disabled ? 'is-disabled' : 'group'" v-for="(item, index) in props.modelValue" :key="index">
        <img :src="item" alt="" class="h-44 object-contain" />
        <div class="absolute inset-0 bg-black/20 justify-center items-center hidden group-hover:flex">
          <ms-icon icon="Delete" :size="28" color="#fff" class="cursor-pointer" @click="deleteImg(index)"></ms-icon>
        </div>
      </div>
    </template>

    <ms-tooltip :tooltip="props.tooltip" :disabled="!props.tooltip">
      <ImgUpload
        class="imgUpload"
        :class="props.disabled ? 'is-disabled' : ''"
        v-show="props.multiple || !props.modelValue"
        ref="imgUpload"
        :bucket="props.bucket"
        :accept="props.accept"
        :url="VITE_APP_UPLOAD"
        :useSSL="VITE_APP_USESSL"
        :port="VITE_APP_PORT"
        :isProgress="false"
        @getFilePath="getFilePath"
        @getAccept="getAccept"
      ></ImgUpload>
    </ms-tooltip>

    <div
      @click="activeUpload"
      class="border-dashed cursor-pointer img"
      :class="props.disabled ? 'is-disabled' : ''"
      v-show="!props.multiple && props.modelValue"
    >
      <img :src="props.modelValue" alt="" v-if="typeof props.modelValue == 'string'" class="h-44 object-contain" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n'
import MSUI from '@/assets/ms-ui/ms-ui.common.js'

const ImgUpload = MSUI.MSFileUpload
interface Props {
  bucket: string
  modelValue: string | string[] | undefined
  accept?: string
  tooltip?: string
  disabled?: boolean
  multiple?: boolean
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'png,jpg'
})

const emits = defineEmits(['update:modelValue'])
const { VITE_APP_UPLOAD, VITE_APP_PORT, VITE_APP_USESSL } = getAppEnvConfig()
const imgUpload = ref()
function deleteImg(i: number) {
  const data = deepCopy(props.modelValue as string[])
  data.splice(i, 1)
  emits('update:modelValue', data)
}
function getFilePath(e: FilePathType) {
  if (props.multiple) {
    const arr = [...(props.modelValue as string[]), e.filePath]
    if (props.limit && arr.length > props.limit) {
      new useMessage().error({
        message: getI18nValue('msg.limit') + props.limit
      })
      return
    }

    emits('update:modelValue', arr)
  } else {
    emits('update:modelValue', e.filePath)
  }
}

function getAccept() {
  new useMessage().error({
    message: getI18nValue('msg.fileFormatError') + ' ' + props.accept.replace(',', ' or ')
  })
}
function activeUpload() {
  if (props.disabled) return
  imgUpload.value.$el?.querySelector('.el-upload__input').click()
}
</script>
<style lang="scss" scoped>
.imgUpload {
  width: 192px;
  height: 192px;
  & > :deep(div) {
    height: 100%;
    & > .el-upload {
      height: 100%;
      & > .el-upload-dragger {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        & > i {
          margin-bottom: 0;
        }
      }
    }
  }
}
.imgUpload.is-disabled {
  cursor: not-allowed;

  & > :deep(div) {
    & > .el-upload {
      pointer-events: none;
      & > .el-upload-dragger {
        background: var(--el-fill-color-light);
      }
    }
  }
}
.img {
  @apply w-48 h-48 box-border border  p-3 flex justify-center items-center  rounded-md overflow-hidden;
  border-color: var(--ms-border-color);
}
.img.is-disabled {
  background: var(--el-fill-color-light);
  cursor: not-allowed;
}
</style>
