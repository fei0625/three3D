<template>
  <el-form size="small">
    <el-form-item>
      <el-radio :label="1" v-model="radioValue">{{ getI18nValue('cron.fill') }}，{{ getI18nValue('cron.wildcard') }}[, - * /] </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio :label="2" v-model="radioValue"> {{ getI18nValue('cron.every') }} </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio :label="3" v-model="radioValue">
        {{ getI18nValue('cron.cycle') }}
        <el-input-number v-model="cycle01" :min="fullYear" /> -
        <el-input-number v-model="cycle02" :min="fullYear" />
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio :label="4" v-model="radioValue">
        {{ getI18nValue('cron.from') }}
        <el-input-number v-model="average01" :min="fullYear" /> {{ getI18nValue('cron.yearBegan') }} <el-input-number v-model="average02" :min="fullYear" />
        {{ getI18nValue('cron.year') }}{{ getI18nValue('cron.execute') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio :label="5" v-model="radioValue">
        {{ getI18nValue('cron.specified') }}
        <el-select clearable v-model="checkboxList" multiple style="width: 100%" :placeholder="getI18nValue('cron.choose')">
          <el-option v-for="item in 9" :key="item" :value="item - 1 + fullYear" :label="item - 1 + fullYear" />
        </el-select>
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { getI18nValue } from '@/utils/i18n/index'
const fullYear = ref(0)
const radioValue = ref<number | string>(1)
const cycle01 = ref(0)
const cycle02 = ref(0)
const average01 = ref(0)
const average02 = ref(1)
const checkboxList = ref([])

const props = defineProps<{
  check: any
  cron: any
}>()
const emits = defineEmits(['update'])

// 单选按钮值变化时
function radioChange() {
  if (props.cron.mouth === '*') {
    emits('update', 'mouth', '0', 'year')
  }
  if (props.cron.day === '*') {
    emits('update', 'day', '0', 'year')
  }
  if (props.cron.hour === '*') {
    emits('update', 'hour', '0', 'year')
  }
  if (props.cron.min === '*') {
    emits('update', 'min', '0', 'year')
  }
  if (props.cron.second === '*') {
    emits('update', 'second', '0', 'year')
  }
  switch (radioValue.value) {
    case 1:
      emits('update', 'year', '')
      break
    case 2:
      emits('update', 'year', '*')
      break
    case 3:
      emits('update', 'year', cycle01.value + '-' + cycle02.value)
      break
    case 4:
      emits('update', 'year', average01.value + '/' + average02.value)
      break
    case 5:
      emits('update', 'year', checkboxString.value)
      break
  }
}
// 周期两个值变化时
function cycleChange() {
  if (radioValue.value == '3') {
    emits('update', 'year', cycleTotal.value)
  }
}
// 平均两个值变化时
function averageChange() {
  if (radioValue.value == '4') {
    emits('update', 'year', averageTotal.value)
  }
}
// checkbox值变化时
function checkboxChange() {
  if (radioValue.value == '5') {
    emits('update', 'year', checkboxString.value)
  }
}

// 计算两个周期值
const cycleTotal = computed(() => {
  cycle01.value = props.check(cycle01.value, fullYear.value, fullYear.value + 100)
  cycle02.value = props.check(cycle02.value, fullYear.value + 1, fullYear.value + 101)
  return cycle01.value + '-' + cycle02.value
})
// 计算平均用到的值
const averageTotal = computed(() => {
  average01.value = props.check(average01.value, fullYear.value, fullYear.value + 100)
  average02.value = props.check(average02.value, 1, 10)
  return average01.value + '/' + average02.value
})
// 计算勾选的checkbox值合集
const checkboxString = computed(() => {
  let str = checkboxList.value.join()
  return str
})

onMounted(() => {
  fullYear.value = +new Date().getFullYear()
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
  fullYear,
  radioValue,
  cycle01,
  cycle02,
  average01,
  average02,
  checkboxList
})
</script>
