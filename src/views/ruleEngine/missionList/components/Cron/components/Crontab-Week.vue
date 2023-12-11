<template>
  <el-form>
    <el-form-item>
      <el-radio v-model="radioValue" :label="1"> {{ getI18nValue('cron.week') }},{{ getI18nValue('cron.wildcard') }}[, - * / L #] </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2"> {{ getI18nValue('cron.specify') }} </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        {{ getI18nValue('cron.period') }}
        <el-input-number v-model="cycle01" :min="1" :max="7" /> -
        <el-input-number v-model="cycle02" :min="1" :max="7" />
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        {{ getI18nValue('cron.first') }}
        <el-input-number v-model="average01" :min="1" :max="4" /> {{ getI18nValue('cron.weekWeek') }}
        <el-input-number v-model="average02" :min="1" :max="7" />
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="5">
        {{ getI18nValue('cron.lastWeek') }}
        <el-input-number v-model="weekday" :min="1" :max="7" />
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="6">
        {{ getI18nValue('cron.specified') }}
        <el-select clearable v-model="checkboxList" multiple style="width: 100%" :placeholder="getI18nValue('cron.choose')">
          <el-option v-for="(item, index) of weekList" :key="index" :value="index + 1">{{ item }}</el-option>
        </el-select>
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
const radioValue = ref<number | string>(2)
const weekday = ref(1)
const cycle01 = ref(1)
const cycle02 = ref(2)
const average01 = ref(1)
const average02 = ref(1)
const checkboxList = ref([])

const weekList = ref([
  getI18nValue('cron.monday'),
  getI18nValue('cron.tuesday'),
  getI18nValue('cron.wednesday'),
  getI18nValue('cron.thursday'),
  getI18nValue('cron.friday'),
  getI18nValue('cron.saturday'),
  getI18nValue('cron.sunday')
])
const props = defineProps<{
  check: any
  cron: any
}>()
const emits = defineEmits(['update'])
// 单选按钮值变化时
function radioChange() {
  if (radioValue.value === 1) {
    emits('update', 'week', '*')
    emits('update', 'year', '*', 'week')
  } else {
    if (props.cron.mouth === '*') {
      emits('update', 'mouth', '0', 'week')
    }
    if (props.cron.day === '*') {
      emits('update', 'day', '0', 'week')
    }
    if (props.cron.hour === '*') {
      emits('update', 'hour', '0', 'week')
    }
    if (props.cron.min === '*') {
      emits('update', 'min', '0', 'week')
    }
    if (props.cron.second === '*') {
      emits('update', 'second', '0', 'week')
    }
  }
  switch (radioValue.value) {
    case 2:
      emits('update', 'week', '?')
      break
    case 3:
      emits('update', 'week', cycle01.value + '-' + cycle02.value)
      break
    case 4:
      emits('update', 'week', average01.value + '#' + average02.value)
      break
    case 5:
      emits('update', 'week', weekday.value + 'L')
      break
    case 6:
      emits('update', 'week', checkboxString.value)
      break
  }
}
// 根据互斥事件，更改radio的值

// 周期两个值变化时
function cycleChange() {
  if (radioValue.value == '3') {
    emits('update', 'week', cycleTotal.value)
  }
}
// 平均两个值变化时
function averageChange() {
  if (radioValue.value == '4') {
    emits('update', 'week', averageTotal.value)
  }
}
// 最近工作日值变化时
function weekdayChange() {
  if (radioValue.value == '5') {
    emits('update', 'week', weekday.value + 'L')
  }
}
// checkbox值变化时
function checkboxChange() {
  if (radioValue.value == '6') {
    emits('update', 'week', checkboxString.value)
  }
}

// 计算两个周期值
const cycleTotal = computed(() => {
  cycle01.value = props.check(cycle01.value, 1, 7)
  cycle02.value = props.check(cycle02.value, 1, 7)
  return cycle01.value + '-' + cycle02.value
})
// 计算平均用到的值
const averageTotal = computed(() => {
  average01.value = props.check(average01.value, 1, 4)
  average02.value = props.check(average02.value, 1, 7)
  return average01.value + '#' + average02.value
})
// 最近的工作日（格式）
const weekdayCheck = computed(() => {
  weekday.value = props.check(weekday.value, 1, 7)
  return weekday.value
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
watch(weekdayCheck, () => {
  weekdayChange()
})
watch(checkboxString, () => {
  checkboxChange()
})
defineExpose({
  radioValue,
  weekday,
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList,
  weekList
})
</script>
