<template>
  <div class="relative">
    <div v-if="type === '2'" class="verify-img-out" :style="{ height: parseInt(setSize.imgHeight.toString()) + vSpace + 'px' }">
      <div class="verify-img-panel" :style="{ width: setSize.imgWidth, height: setSize.imgHeight }">
        <img :src="'data:image/png;base64,' + backImgBase" alt="" class="w-full h-full block" />
        <div class="verify-refresh" @click="refresh" v-show="showRefresh">
          <ms-icon icon="RefreshRight" :size="20" color="#000"></ms-icon>
        </div>
        <transition name="tips">
          <span class="verify-tips" v-if="tipWords" :class="passFlag ? 'suc-bg' : 'err-bg'">{{ tipWords }}</span>
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div class="verify-bar-area" :style="{ width: setSize.imgWidth, height: barSize.height, 'line-height': barSize.height }">
      <span class="verify-msg" v-text="text"></span>
      <div
        class="verify-left-bar"
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          height: barSize.height,
          'border-color': leftBarBorderColor
        }"
      >
        <span class="verify-msg" v-text="finishText"></span>
        <div
          class="verify-move-block"
          @touchstart="start"
          @mousedown="start"
          :style="{
            width: barSize.height,
            height: barSize.height,
            'background-color': moveBlockBackgroundColor,
            'border-color': leftBarBorderColor,
            left: moveBlockLeft,
            transition: transitionLeft
          }"
        >
          <ms-icon :icon="iconClass" :size="20" :color="iconColor"></ms-icon>
          <div
            v-if="type === '2'"
            class="verify-sub-block"
            :style="{
              width: Math.floor((parseInt(setSize.imgWidth.toString()) * 47) / 310) + 'px',
              height: setSize.imgHeight,
              top: '-' + (parseInt(setSize.imgHeight.toString()) + vSpace) + 'px',
              'background-size': setSize.imgWidth + ' ' + setSize.imgHeight
            }"
          >
            <img :src="'data:image/png;base64,' + blockBackImgBase" alt="" style="width: 100%; height: 100%; display: block; -webkit-user-drag: none" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
import { captchaGet, captchaCheck } from '@/apis/login'
import { aesEncrypt } from './../utils/ase'
import { resetSize } from '../utils/util'
import { ComponentInternalInstance } from 'vue'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
const props = withDefaults(
  defineProps<{
    captchaType: string
    type?: string
    mode?: 'pop' | 'fixed'
    vSpace?: number
    explain?: string
    imgSize?: { width: string; height: string }
    blockSize?: { width: string; height: string }
    barSize?: { width: string; height: string }
  }>(),
  {
    type: '1',
    mode: 'fixed',
    vSpace: 5,
    explain: getI18nValue('login.completeValidation'),
    imgSize: () => ({ width: '310px', height: '155px' }),
    blockSize: () => ({ width: '50px', height: '50px' }),
    barSize: () => ({ width: '310px', height: '40px' })
  }
)

const { mode, captchaType, vSpace, barSize, type, blockSize, explain } = toRefs(props)

const { proxy } = getCurrentInstance() as ComponentInternalInstance

const secretKey = ref(''), //后端返回的ase加密秘钥
  passFlag = ref(false), //是否通过的标识
  backImgBase = ref(''), //验证码背景图片
  blockBackImgBase = ref(''), //验证滑块的背景图片
  backToken = ref(''), //后端返回的唯一token值
  startMoveTime = ref(), //移动开始的时间
  endMoveTime = ref(0), //移动结束的时间
  tipWords = ref(''),
  text = ref(''),
  finishText = ref(''),
  setSize = reactive({
    imgHeight: 0,
    imgWidth: 0,
    barHeight: 0,
    barWidth: 0
  }),
  moveBlockLeft = ref(''),
  leftBarWidth = ref(''),
  // 移动中样式
  moveBlockBackgroundColor = ref(''),
  leftBarBorderColor = ref('#ddd'),
  iconColor = ref('#000'),
  iconClass = ref('ArrowRight'),
  status = ref(false), //鼠标状态
  isEnd = ref(false), //是够验证完成
  showRefresh = ref(true),
  transitionLeft = ref(''),
  transitionWidth = ref(''),
  startLeft = ref(0),
  move_block = ref(0),
  move_block_left = ref(0)

const barArea = computed(() => {
  return proxy?.$el.querySelector('.verify-bar-area')
})
function init() {
  text.value = explain.value
  getPicture()

  nextTick(() => {
    let { imgHeight, imgWidth, barHeight, barWidth } = resetSize(proxy)
    setSize.imgHeight = imgHeight
    setSize.imgWidth = imgWidth
    setSize.barHeight = barHeight
    setSize.barWidth = barWidth
    proxy?.$parent && proxy.$parent.$emit('ready', proxy)
  })
  window.addEventListener('mouseup', function () {
    window.removeEventListener('mousemove', move)
    end()
  })
  // 兼容移动端 当移走手指时  事件
  window.addEventListener('touchend', function () {
    window.removeEventListener('touchmove', move)
    end()
  })
}
watch(type, () => {
  init()
})
onMounted(() => {
  // 禁止拖拽
  init()
  proxy &&
    (proxy.$el.onselectstart = function () {
      return false
    })
})
//鼠标按下
function start(e: MouseEvent | TouchEvent) {
  e = e || window.event
  let x
  if (!(e as TouchEvent).touches) {
    //兼容PC端
    x = (e as MouseEvent).clientX
  } else {
    //兼容移动端
    x = (e as TouchEvent).touches[0].pageX
  }
  startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left)
  startMoveTime.value = +new Date() //开始滑动的时间
  if (isEnd.value == false) {
    text.value = ''
    moveBlockBackgroundColor.value = globalStore.global.primary
    leftBarBorderColor.value = globalStore.global.primary
    iconColor.value = '#fff'
    e.stopPropagation()
    status.value = true
  }
  window.addEventListener('mousemove', move)
  // 兼容移动端 当移动手指时  事件
  window.addEventListener('touchmove', move)
}
//鼠标移动
function move(e: MouseEvent | TouchEvent) {
  e = e || window.event
  if (status.value && isEnd.value == false) {
    let x
    if (!(e as TouchEvent).touches) {
      //兼容PC端
      x = (e as MouseEvent).clientX
    } else {
      //兼容移动端
      x = (e as TouchEvent).touches[0].pageX
    }
    let bar_area_left = barArea.value.getBoundingClientRect().left
    move_block_left.value = (move_block.value ?? 0) + (x - bar_area_left - startLeft.value) //小方块相对于父元素的left值
    if (move_block_left.value >= barArea.value.offsetWidth - parseInt(blockSize.value.width)) {
      move_block_left.value = barArea.value.offsetWidth - parseInt(blockSize.value.width)
    }
    if (move_block_left.value <= 0) {
      move_block_left.value = 0
    }
    //拖动后小方块的left值
    moveBlockLeft.value = move_block_left.value + 'px'
    leftBarWidth.value = move_block_left.value + 'px'
  }
}

//鼠标松开
async function end() {
  move_block.value = move_block_left.value
  endMoveTime.value = +new Date()
  //判断是否重合
  if (status.value && isEnd.value == false) {
    let moveLeftDistance = parseInt((moveBlockLeft.value || '').replace('px', ''))
    moveLeftDistance = (moveLeftDistance * 310) / parseInt(setSize.imgWidth.toString())
    let data = {
      captchaType: captchaType.value,
      pointJson: secretKey.value
        ? aesEncrypt(JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey.value)
        : JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
      token: backToken.value
    }
    try {
      await captchaCheck(data).send()
      moveBlockBackgroundColor.value = '#5cb85c'
      leftBarBorderColor.value = '#5cb85c'
      iconColor.value = '#fff'
      iconClass.value = 'Check'
      showRefresh.value = false
      isEnd.value = true
      if (mode.value == 'pop') {
        setTimeout(() => {
          if (proxy?.$parent) {
            ;(proxy.$parent as any).clickShow = false
          }
          refresh()
        }, 1500)
      }
      passFlag.value = true
      tipWords.value = `${((endMoveTime.value - startMoveTime.value) / 1000).toFixed(2)}s${getI18nValue('login.verificationSuccess')}`
      let captchaVerification = secretKey.value
        ? aesEncrypt(backToken.value + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 }), secretKey.value)
        : backToken.value + '---' + JSON.stringify({ x: moveLeftDistance, y: 5.0 })
      setTimeout(() => {
        tipWords.value = ''
        proxy?.$parent && (proxy.$parent as any).closeBox()
        proxy?.$parent && proxy.$parent.$emit('success', { captchaVerification })
      }, 1000)
    } catch (error) {
      moveBlockBackgroundColor.value = '#d9534f'
      leftBarBorderColor.value = '#d9534f'
      iconColor.value = '#fff'
      iconClass.value = 'Close'
      passFlag.value = false
      setTimeout(function () {
        refresh()
      }, 1000)
      proxy?.$parent && proxy.$parent.$emit('error', proxy)
      tipWords.value = getI18nValue('login.validationFailure')
      setTimeout(() => {
        tipWords.value = ''
      }, 1000)
    }

    status.value = false
  }
}

const refresh = () => {
  showRefresh.value = true
  finishText.value = ''

  transitionLeft.value = 'left .3s'
  moveBlockLeft.value = ''

  leftBarWidth.value = ''
  transitionWidth.value = 'width .3s'
  move_block.value = 0
  move_block_left.value = 0
  leftBarBorderColor.value = '#ddd'
  moveBlockBackgroundColor.value = '#fff'
  iconColor.value = '#000'
  iconClass.value = 'ArrowRight'
  isEnd.value = false

  getPicture()
  setTimeout(() => {
    transitionWidth.value = ''
    transitionLeft.value = ''
    text.value = explain.value
  }, 300)
}

// 请求背景图片和验证图片
async function getPicture() {
  try {
    const { data } = await captchaGet({
      captchaType: captchaType.value
    }).send()

    backImgBase.value = data.originalImageBase64
    blockBackImgBase.value = data.jigsawImageBase64
    backToken.value = data.token
    secretKey.value = data.secretKey
  } catch (error: any) {
    const { msg } = error
    tipWords.value = msg
  }
}

defineExpose({
  refresh
})
</script>

<style lang="scss" scoped src="../index.scss"></style>
