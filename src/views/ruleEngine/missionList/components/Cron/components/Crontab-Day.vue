<template>
  <el-form>
    <el-form-item>
      <el-radio v-model="radioValue" :label="1"> {{ getI18nValue('cron.day') }},{{ getI18nValue('cron.wildcard') }}[, - * / L M] </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2"> {{ getI18nValue('cron.specify') }} </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        {{ getI18nValue('cron.cycle') }}
        <el-input-number v-model="cycle01" :min="0" :max="31" /> - <el-input-number v-model="cycle02" :min="0" :max="31" /> {{ getI18nValue('cron.day') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        {{ getI18nValue('cron.from') }}
        <el-input-number v-model="average01" :min="0" :max="31" /> {{ getI18nValue('cron.start') }}<el-input-number v-model="average02" :min="0" :max="31" />
        {{ getI18nValue('cron.day') }}{{ getI18nValue('cron.execute') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="5">
        {{ getI18nValue('cron.monthly') }}
        <el-input-number v-model="workday" :min="0" :max="31" /> {{ getI18nValue('cron.working') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="6"> {{ getI18nValue('cron.lastDay') }} </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="7">
        {{ getI18nValue('cron.specified') }}
        <el-select clearable v-model="checkboxList" :placeholder="getI18nValue('cron.choose')" multiple style="width: 100%">
          <el-option v-for="item in 31" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
const radioValue = ref<number | string>(1)
const workday = ref(1)
const cycle01 = ref(1)
const cycle02 = ref(2)
const average01 = ref(1)
const average02 = ref(1)
const checkboxList = ref([])

const props = defineProps<{
  check: any
  cron: any
}>()
const emits = defineEmits(['update'])

// 单选按钮值变化时
function radioChange() {
  if (radioValue.value === 1) {
    emits('update', 'day', '*', 'day')
    emits('update', 'week', '?', 'day')
    emits('update', 'mouth', '*', 'day')
  } else {
    if (props.cron.hour === '*') {
      emits('update', 'hour', '0', 'day')
    }
    if (props.cron.min === '*') {
      emits('update', 'min', '0', 'day')
    }
    if (props.cron.second === '*') {
      emits('update', 'second', '0', 'day')
    }
  }

  switch (radioValue.value) {
    case 2:
      emits('update', 'day', '?')
      break
    case 3:
      emits('update', 'day', cycle01.value + '-' + cycle02.value)
      break
    case 4:
      emits('update', 'day', average01.value + '/' + average02.value)
      break
    case 5:
      emits('update', 'day', workday.value + 'W')
      break
    case 6:
      emits('update', 'day', 'L')
      break
    case 7:
      emits('update', 'day', checkboxString.value)
      break
  }
}
// 周期两个值变化时
function cycleChange() {
  if (radioValue.value == '3') {
    emits('update', 'day', cycleTotal.value)
  }
}
// 平均两个值变化时
function averageChange() {
  if (radioValue.value == '4') {
    emits('update', 'day', averageTotal.value)
  }
}
// 最近工作日值变化时
function workdayChange() {
  if (radioValue.value == '5') {
    emits('update', 'day', workday.value + 'W')
  }
}
// checkbox值变化时
function checkboxChange() {
  if (radioValue.value == '7') {
    emits('update', 'day', checkboxString.value)
  }
}
// 父组件传递的week发生变化触发
function weekChange() {
  //判断week值与day不能同时为“?”
  if (props.cron.week == '?' && radioValue.value == '2') {
    radioValue.value = '1'
  } else if (props.cron.week !== '?' && radioValue.value != '2') {
    radioValue.value = '2'
  }
}

// 计算两个周期值
const cycleTotal = computed(() => {
  cycle01.value = props.check(cycle01.value, 1, 31)
  cycle02.value = props.check(cycle02.value, 1, 31)
  return cycle01.value + '-' + cycle02.value
})
// 计算平均用到的值
const averageTotal = computed(() => {
  average01.value = props.check(average01.value, 1, 31)
  average02.value = props.check(average02.value, 1, 31)
  return average01.value + '/' + average02.value
})
// 计算工作日格式
const workdayCheck = computed(() => {
  workday.value = props.check(workday.value, 1, 31)
  return workday.value
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
watch(workdayCheck, () => {
  workdayChange()
})
watch(checkboxString, () => {
  checkboxChange()
})
defineExpose({
  radioValue,
  workday,
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList
})
</script>
