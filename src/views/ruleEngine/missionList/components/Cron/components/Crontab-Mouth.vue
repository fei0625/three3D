<template>
  <el-form>
    <el-form-item>
      <el-radio v-model="radioValue" :label="1"> {{ getI18nValue('cron.month') }},{{ getI18nValue('cron.wildcard') }}[, - * /] </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="2">
        {{ getI18nValue('cron.specify') }}
        <el-input-number v-model="cycle01" :min="1" :max="12" /> - <el-input-number v-model="cycle02" :min="1" :max="12" /> {{ getI18nValue('cron.month') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="3">
        {{ getI18nValue('cron.from') }}
        <el-input-number v-model="average01" :min="1" :max="12" /> {{ getI18nValue('cron.monthBegins') }}
        <el-input-number v-model="average02" :min="1" :max="12" /> {{ getI18nValue('cron.month') }}{{ getI18nValue('cron.month')
        }}{{ getI18nValue('cron.execute') }}
      </el-radio>
    </el-form-item>

    <el-form-item>
      <el-radio v-model="radioValue" :label="4">
        {{ getI18nValue('cron.monthly') }}
        <el-select clearable v-model="checkboxList" :placeholder="getI18nValue('cron.choose')" multiple style="width: 100%">
          <el-option v-for="item in 12" :key="item" :value="item">{{ item }}</el-option>
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
    emits('update', 'mouth', '*')
    emits('update', 'year', '*')
  } else {
    if (props.cron.day === '*') {
      emits('update', 'day', '0', 'mouth')
    }
    if (props.cron.hour === '*') {
      emits('update', 'hour', '0', 'mouth')
    }
    if (props.cron.min === '*') {
      emits('update', 'min', '0', 'mouth')
    }
    if (props.cron.second === '*') {
      emits('update', 'second', '0', 'mouth')
    }
  }
  switch (radioValue.value) {
    case 2:
      emits('update', 'mouth', cycle01.value + '-' + cycle02.value)
      break
    case 3:
      emits('update', 'mouth', average01.value + '/' + average02.value)
      break
    case 4:
      emits('update', 'mouth', checkboxString.value)
      break
  }
}
// 周期两个值变化时
function cycleChange() {
  if (radioValue.value == '2') {
    emits('update', 'mouth', cycleTotal.value)
  }
}
// 平均两个值变化时
function averageChange() {
  if (radioValue.value == '3') {
    emits('update', 'mouth', averageTotal.value)
  }
}
// checkbox值变化时
function checkboxChange() {
  if (radioValue.value == '4') {
    emits('update', 'mouth', checkboxString.value)
  }
}

// 计算两个周期值
const cycleTotal = computed(() => {
  cycle01.value = props.check(cycle01.value, 1, 12)
  cycle02.value = props.check(cycle02.value, 1, 12)
  return cycle01.value + '-' + cycle02.value
})
// 计算平均用到的值
const averageTotal = computed(() => {
  average01.value = props.check(average01.value, 1, 12)
  average02.value = props.check(average02.value, 1, 12)
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
