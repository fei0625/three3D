<template>
  <el-dialog v-model="isVisible" v-bind="defaultConfig">
    <template #header="scope">
      <slot name="header" v-bind="scope"></slot>
    </template>
    <template #default>
      <main class="max-h-[400px] overflow-y-auto" v-if="propsRef?.isMaxHeight">
        <slot></slot>
      </main>
      <slot v-else></slot>
    </template>
    <template #footer>
      <ms-button @click="isVisible = false" v-if="propsRef?.isCancel">{{ getI18nValue('btn.cancel') }} </ms-button>
      <ms-button type="primary" v-if="propsRef?.isConfirm" @click="handleConfirm" :loading="confirmLoading">{{ getI18nValue('btn.confirm') }}</ms-button>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
import { DialogActionType, DialogProps } from './types'

const emits = defineEmits(['register', 'ok'])
const propsRef = ref<DialogProps>() //hooks属性
const isVisible = ref(false)
const confirmLoading = ref(false)

const defaultConfig = ref<DialogProps>({
  alignCenter: true,
  width: '50%',
  destroyOnClose: true,
  closeOnClickModal: false
})
async function setProps(props: DialogProps) {
  propsRef.value = deepMerge(propsRef.value || {}, deepCopy(props))
  if (propsRef.value?.isCancel ?? true) {
    propsRef.value['isCancel'] = true
  }
  if (propsRef.value?.isConfirm ?? true) {
    propsRef.value['isConfirm'] = true
  }
  if (propsRef.value?.isMaxHeight ?? true) {
    propsRef.value['isMaxHeight'] = true
  }

  const { isCancel, isConfirm, ...dialoPropsAttr } = propsRef.value
  defaultConfig.value = {
    ...defaultConfig.value,
    ...dialoPropsAttr
  }
}

const dialogAction: DialogActionType = {
  setProps,
  setIsVisible: (flag: boolean) => {
    isVisible.value = flag
  },
  setConfirmLoading: (flag: boolean) => {
    confirmLoading.value = flag
  }
}

const handleConfirm = debounce(() => {
  emits('ok')
})

onMounted(() => {
  emits('register', dialogAction)
})
</script>
<style lang="scss" scoped src="./styles.scss"></style>
