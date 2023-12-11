<template>
  <div class="w-full">
    <el-select v-model="value" filterable v-bind="$attrs" class="w-full">
      <el-option v-for="(item, index) in props.option" :key="index" :label="item[props.labelField]" :disabled="item.disabled" :value="item[props.valueField]" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
interface Props {
  option: any
  modelValue: any
  labelField?: string
  valueField?: string
}
const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value'
})
const emits = defineEmits(['update:modelValue'])
let value = ref(props.modelValue)

watch(value, v => {
  emits('update:modelValue', v)
})

watch(
  () => props.modelValue,
  v => {
    value.value = v
  }
)

defineOptions({
  inheritAttrs: false
})
</script>
<style lang="scss" scoped></style>
