<template>
  <el-form>
    <el-form-item>
      <el-radio v-model="radioValue" :label="1"> {{ getI18nValue('cron.second') }},{{ getI18nValue('cron.wildcard') }}[, - * /] </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2">
        {{ getI18nValue('cron.cycle') }}
        <el-input-number v-model="cycle01" :min="0" :max="60" /> - <el-input-number v-model="cycle02" :min="0" :max="60" /> {{ getI18nValue('cron.second') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        {{ getI18nValue('cron.from') }}
        <el-input-number v-model="average01" :min="0" :max="60" /> {{ getI18nValue('cron.secondsStart') }}
        <el-input-number v-model="average02" :min="0" :max="60" /> {{ getI18nValue('cron.second') }}{{ getI18nValue('cron.execute') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        {{ getI18nValue('cron.specified') }}
        <el-select clearable v-model="checkboxList" multiple style="width: 100%" :placeholder="getI18nValue('cron.choose')">
          <el-option v-for="item in 60" :key="item" :value="item - 1">{{ item - 1 }}</el-option>
        </el-select>
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
const radioValue = ref<number | string>(1)
const cycle01 = ref(1)
const cycle02 = ref(2)
const average01 = ref(0)
const average02 = ref(1)
const checkboxList = ref([])

const props = defineProps<{
  check: any
}>()
const emits = defineEmits(['update'])

// 单选按钮值变化时
function radioChange() {
  switch (radioValue.value) {
    case 1:
      emits('update', 'second', '*', 'second')
      emits('update', 'min', '*', 'second')
      break
    case 2:
      emits('update', 'second', cycle01.value + '-' + cycle02.value)
      break
    case 3:
      emits('update', 'second', average01.value + '/' + average02.value)
      break
    case 4:
      emits('update', 'second', checkboxString.value)
      break
  }
}
// 周期两个值变化时
function cycleChange() {
  if (radioValue.value == '2') {
    emits('update', 'second', cycleTotal.value)
  }
}
// 平均两个值变化时
function averageChange() {
  if (radioValue.value == '3') {
    emits('update', 'second', averageTotal.value)
  }
}
// checkbox值变化时
function checkboxChange() {
  if (radioValue.value == '4') {
    emits('update', 'second', checkboxString.value)
  }
}
// function  othChange() {
//     //反解析
//     let ins = this.cron.second('反解析 second', ins)
//     if (ins === '*') {
//       this.radioValue = 1
//     } else if (ins.indexOf('-') > -1) {
//       this.radioValue = 2
//     } else if (ins.indexOf('/') > -1) {
//       this.radioValue = 3
//     } else {
//       this.radioValue = 4
//       this.checkboxList = ins.split(',')
//     }
//   }

// 计算两个周期值
const cycleTotal = computed(() => {
  cycle01.value = props.check(cycle01.value, 0, 59)
  cycle02.value = props.check(cycle02.value, 0, 59)
  return cycle01.value + '-' + cycle02.value
})
// 计算平均用到的值
const averageTotal = computed(() => {
  average01.value = props.check(average01.value, 0, 59)
  average02.value = props.check(average02.value, 1, 59)
  return average01.value + '/' + average02.value
})

// 计算勾选的checkbox值合集
const checkboxString = computed(() => {
  let str = checkboxList.value.join()
  return str == '' ? '*' : str
})

watch(radioValue, () => {
  radioChange()
})
watch(cycleTotal, () => {
  cycleChange()
})
watch(averageTotal, () => {
  averageChange()
})
watch(checkboxString, () => {
  checkboxChange()
})

defineExpose({
  radioValue,
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList
})
</script>
