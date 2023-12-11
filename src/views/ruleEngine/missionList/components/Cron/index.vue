<template>
  <MSDialog @register="dialogRegister" :title="getI18nValue('missionList.cron')">
    <el-tabs type="border-card">
      <el-tab-pane :label="getI18nValue('cron.second')" v-if="shouldHide('second')">
        <CrontabSecond @update="updateContabValue" :check="checkNumber" :ref="el => setRefMap(el, 'cronsecond')" />
      </el-tab-pane>

      <el-tab-pane :label="getI18nValue('cron.min')" v-if="shouldHide('min')">
        <CrontabMin @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" :ref="el => setRefMap(el, 'cronmin')" />
      </el-tab-pane>

      <el-tab-pane :label="getI18nValue('cron.hours')" v-if="shouldHide('hour')">
        <CrontabHour @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" :ref="el => setRefMap(el, 'cronhour')" />
      </el-tab-pane>

      <el-tab-pane :label="getI18nValue('cron.day')" v-if="shouldHide('day')">
        <CrontabDay @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" :ref="el => setRefMap(el, 'cronday')" />
      </el-tab-pane>

      <el-tab-pane :label="getI18nValue('cron.month')" v-if="shouldHide('mouth')">
        <CrontabMouth @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" :ref="el => setRefMap(el, 'cronmouth')" />
      </el-tab-pane>

      <el-tab-pane :label="getI18nValue('cron.week')" v-if="shouldHide('week')">
        <CrontabWeek @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" :ref="el => setRefMap(el, 'cronweek')" />
      </el-tab-pane>

      <el-tab-pane :label="getI18nValue('cron.year')" v-if="shouldHide('year')">
        <CrontabYear @update="updateContabValue" :check="checkNumber" :cron="contabValueObj" :ref="el => setRefMap(el, 'cronyear')" />
      </el-tab-pane>
    </el-tabs>

    <div class="popup-main">
      <!-- 提示     -->
      <CrontabResult :ex="contabValueString"></CrontabResult>

      <!-- cron 表达式     -->
      <div class="popup-result">
        <p class="title">{{ getI18nValue('cron.dataExpression') }}</p>
        <article class="w-full text-center flex">
          <section v-for="(item, key, index) in contabValueObj" :key="index" class="min-w-[64px]">
            <article class="mr-1 text-xs font-bold">{{ tabTitles[key] }}</article>
            <div class="h-8 border border-gray-300 mr-1 leading-8 text-xs mt-2">
              {{ item }}
            </div>
          </section>
          <section class="flex-1 overflow-hidden">
            <article class="text-xs font-bold">{{ getI18nValue('cron.crontabExpression') }}</article>
            <div class="h-8 border border-gray-300 leading-8 text-xs mt-2">
              {{ contabValueString }}
            </div>
          </section>
        </article>
      </div>
    </div>
    <template #footer>
      <ms-button type="primary" @click="submitFill">{{ getI18nValue('btn.confirm') }}</ms-button>
      <ms-button @click="clearCron">{{ getI18nValue('btn.reset') }}</ms-button>
      <ms-button @click="hidePopup">{{ getI18nValue('btn.cancel') }}</ms-button>
    </template>
  </MSDialog>
</template>

<script setup lang="ts">
import { useDialog, MSDialog } from '@/components/ms-dialog'
import { getI18nValue } from '@/utils/i18n/index'
import CrontabSecond from './components/Crontab-Second.vue'
import CrontabMin from './components/Crontab-Min.vue'
import CrontabHour from './components/Crontab-Hour.vue'
import CrontabDay from './components/Crontab-Day.vue'
import CrontabMouth from './components/Crontab-Mouth.vue'
import CrontabWeek from './components/Crontab-Week.vue'
import CrontabYear from './components/Crontab-Year.vue'
import CrontabResult from './components/Crontab-Result.vue'
const { register: dialogRegister, methods: dialogMethods } = useDialog({
  isCancel: false,
  isConfirm: false,
  onClose: hidePopup
})
const tabTitles = ref<any>({
  second: getI18nValue('cron.second'),
  min: getI18nValue('cron.min'),
  hour: getI18nValue('cron.hours'),
  day: getI18nValue('cron.day'),
  mouth: getI18nValue('cron.month'),
  week: getI18nValue('cron.week'),
  year: getI18nValue('cron.year')
})
const props = defineProps<{
  expression: string
  hideComponent?: string[]
  modelValue: boolean
}>()

const emits = defineEmits(['fill', 'update:modelValue'])
const contabValueObj = ref<any>({
  second: '*',
  min: '*',
  hour: '*',
  day: '*',
  mouth: '*',
  week: '?',
  year: ''
})
const refMap: Record<string, any> = {}
const setRefMap = (el: any, name: string) => {
  if (el) {
    refMap[`${name}`] = el
  }
}

function shouldHide(key: any) {
  if (props.hideComponent && props.hideComponent.includes(key)) return false
  return true
}
function resolveExp() {
  //反解析 表达式
  if (props.expression) {
    let arr = props.expression.split(' ')
    if (arr.length >= 6) {
      //6 位以上是合法表达式
      let obj: any = {
        second: arr[0],
        min: arr[1],
        hour: arr[2],
        day: arr[3],
        mouth: arr[4],
        week: arr[5],
        year: arr[6] ? arr[6] : ''
      }
      contabValueObj.value = {
        ...obj
      }
      for (let i in obj) {
        if (obj[i]) changeRadio(i, obj[i])
      }
    }
  } else {
    //没有传入的表达式 则还原
    clearCron()
  }
}

// 由子组件触发，更改表达式组成的字段值
function updateContabValue(name: string, value: any, from: string) {
  // 'updateContabValue', name, value, from
  contabValueObj.value[name] = value
  if (from && from !== name) {
    //console.log(`来自组件 ${from} 改变了 ${name} ${value}`)
    changeRadio(name, value)
  }
}
//赋值到组件
function changeRadio(name: any, value: any) {
  let arr = ['second', 'min', 'hour', 'mouth'],
    refName = 'cron' + name,
    insVlaue
  if (!refMap[refName]) return
  if (arr.includes(name)) {
    if (value === '*') {
      insVlaue = 1
    } else if (value.indexOf('-') > -1) {
      let indexArr = value.split('-')
      isNaN(indexArr[0]) ? (refMap[refName].cycle01 = 0) : (refMap[refName].cycle01 = indexArr[0])
      refMap[refName].cycle02 = indexArr[1]
      insVlaue = 2
    } else if (value.indexOf('/') > -1) {
      let indexArr = value.split('/')
      isNaN(indexArr[0]) ? (refMap[refName].average01 = 0) : (refMap[refName].average01 = indexArr[0])
      refMap[refName].average02 = indexArr[1]
      insVlaue = 3
    } else {
      insVlaue = 4
      refMap[refName].checkboxList = value.split(',').map((item: any) => +item)
    }
  } else if (name == 'day') {
    if (value === '*') {
      insVlaue = 1
    } else if (value == '?') {
      insVlaue = 2
    } else if (value.indexOf('-') > -1) {
      let indexArr = value.split('-')
      isNaN(indexArr[0]) ? (refMap[refName].cycle01 = 0) : (refMap[refName].cycle01 = indexArr[0])
      refMap[refName].cycle02 = indexArr[1]
      insVlaue = 3
    } else if (value.indexOf('/') > -1) {
      let indexArr = value.split('/')
      isNaN(indexArr[0]) ? (refMap[refName].average01 = 0) : (refMap[refName].average01 = indexArr[0])
      refMap[refName].average02 = indexArr[1]
      insVlaue = 4
    } else if (value.indexOf('W') > -1) {
      let indexArr = value.split('W')
      isNaN(indexArr[0]) ? (refMap[refName].workday = 0) : (refMap[refName].workday = indexArr[0])
      insVlaue = 5
    } else if (value === 'L') {
      insVlaue = 6
    } else {
      refMap[refName].checkboxList = value.split(',').map((item: any) => +item)
      insVlaue = 7
    }
  } else if (name == 'week') {
    if (value === '*') {
      insVlaue = 1
    } else if (value == '?') {
      insVlaue = 2
    } else if (value.indexOf('-') > -1) {
      let indexArr = value.split('-')
      isNaN(indexArr[0]) ? (refMap[refName].cycle01 = 0) : (refMap[refName].cycle01 = indexArr[0])
      refMap[refName].cycle02 = indexArr[1]
      insVlaue = 3
    } else if (value.indexOf('#') > -1) {
      let indexArr = value.split('#')
      isNaN(indexArr[0]) ? (refMap[refName].average01 = 1) : (refMap[refName].average01 = indexArr[0])
      refMap[refName].average02 = indexArr[1]
      insVlaue = 4
    } else if (value.indexOf('L') > -1) {
      let indexArr = value.split('L')
      isNaN(indexArr[0]) ? (refMap[refName].weekday = 1) : (refMap[refName].weekday = indexArr[0])
      insVlaue = 5
    } else {
      refMap[refName].checkboxList = value.split(',').map((item: any) => +item)
      insVlaue = 7
    }
  } else if (name == 'year') {
    if (value == '') {
      insVlaue = 1
    } else if (value == '*') {
      insVlaue = 2
    } else if (value.indexOf('-') > -1) {
      insVlaue = 3
    } else if (value.indexOf('/') > -1) {
      insVlaue = 4
    } else {
      refMap[refName].checkboxList = value.split(',').map((item: any) => +item)
      insVlaue = 5
    }
  }
  refMap[refName].radioValue = insVlaue
}
// 表单选项的子组件校验数字格式（通过-props传递）
function checkNumber(value: any, minLimit: any, maxLimit: any) {
  //检查必须为整数
  value = Math.floor(value)
  if (value < minLimit) {
    value = minLimit
  } else if (value >= maxLimit) {
    value = maxLimit
  }
  return value
}
// 隐藏弹窗
function hidePopup() {
  emits('update:modelValue', false)
}
// 填充表达式
function submitFill() {
  emits('fill', contabValueString.value)
  hidePopup()
}
function clearCron() {
  // 还原选择项
  // ;('准备还原')
  contabValueObj.value = {
    second: '*',
    min: '*',
    hour: '*',
    day: '*',
    mouth: '*',
    week: '?',
    year: ''
  }
  for (let j in contabValueObj.value) {
    changeRadio(j, contabValueObj.value[j])
  }
}

const contabValueString = computed(() => {
  let obj = contabValueObj.value
  let str = obj.second + ' ' + obj.min + ' ' + obj.hour + ' ' + obj.day + ' ' + obj.mouth + ' ' + obj.week + (obj.year == '' ? '' : ' ' + obj.year)
  return str
})

onMounted(async () => {
  dialogMethods.setIsVisible(true)
  await nextTick()
  resolveExp()
})
</script>

<style lang="scss">
.popup-main {
  .popup-result {
    @apply border border-gray-300 p-6 relative mt-8;
    & > .title {
      @apply text-center absolute left-1/2 h-8 bg-white w-32;
      transform: translateX(-50%);
      top: -16px;
    }
  }
}
</style>
