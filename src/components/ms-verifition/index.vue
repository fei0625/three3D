<template>
  <div :class="mode == 'pop' ? 'mask' : ''" v-show="showBox">
    <div :class="mode == 'pop' ? 'verifybox' : ''" :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }">
      <div class="verifybox-top" v-if="mode == 'pop'">
        {{ getI18nValue('login.securityVerification') }}
        <span class="verifybox-top-close" @click="closeBox">
          <ms-icon icon="Close" :size="20"></ms-icon>
        </span>
      </div>
      <div class="verifybox-bottom" :style="{ padding: mode == 'pop' ? '15px' : '0' }">
        <!-- 验证码容器 -->
        <component
          v-if="componentType"
          :is="verifyComponent[componentType]"
          :captchaType="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :vSpace="vSpace"
          :explain="explain"
          :imgSize="imgSize"
          :blockSize="blockSize"
          :barSize="barSize"
          ref="instance"
        ></component>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import VerifySlide from './Verify/VerifySlide.vue'
const props = withDefaults(
  defineProps<{
    captchaType: string
    figure?: number
    arith?: number
    mode?: 'pop' | 'fixed'
    vSpace?: number
    explain?: string
    imgSize?: { width: string; height: string }
    blockSize?: { width: string; height: string }
    barSize?: { width: string; height: string }
  }>(),
  {
    mode: 'pop',
    imgSize: () => ({ width: '310px', height: '155px' })
  }
)

const { captchaType, figure, arith, mode, vSpace, explain, imgSize, blockSize, barSize } = toRefs(props)
const clickShow = ref(false)
const verifyType = ref('')
const componentType = ref('')

const instance = ref()
const verifyComponent = markRaw<any>({
  VerifySlide
})
const showBox = computed(() => {
  if (mode.value == 'pop') {
    return clickShow.value
  } else {
    return true
  }
})
/**
 * refresh
 * @description 刷新
 * */
const refresh = () => {
  if (instance.value.refresh) {
    instance.value.refresh()
  }
}
const closeBox = () => {
  clickShow.value = false
  refresh()
}
const show = () => {
  if (mode.value == 'pop') {
    clickShow.value = true
  }
}
watchEffect(() => {
  switch (captchaType.value) {
    case 'blockPuzzle':
      verifyType.value = '2'
      componentType.value = 'VerifySlide'
      break
    case 'clickWord':
      verifyType.value = ''
      componentType.value = 'VerifyPoints'
      break
  }
})

defineExpose({
  show,
  closeBox,
  clickShow
})
</script>
<style lang="scss" scoped src="./index.scss"></style>
