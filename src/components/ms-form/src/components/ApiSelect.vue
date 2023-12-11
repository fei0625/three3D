<template>
  <div class="w-full">
    <el-select v-model="value" filterable v-bind="$attrs" class="w-full">
      <el-option v-for="(item, index) in option" :key="index" :label="item[props?.labelField]" :value="item[props?.valueField]" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash-es'
interface Props {
  api: Fn
  params?: any
  labelField?: string
  valueField?: string
  modelValue: any
  isDefault?: boolean //是否默认选中
  onChange?: Function
  onSuccess?: (data: any[]) => void
  isImmediate?: boolean //是否立即执行
}
const emits = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value',
  isDefault: false,
  isImmediate: true
})
let hisParmas = ref(props.params)
let value = ref(props.modelValue)
let option = ref<any>([])
async function load() {
  try {
    let { data } = await props.api(props.params).send()
    if (Array.isArray(data)) {
      option.value = data
    } else {
      option.value = data.records
    }
    if (props.isDefault) {
      if (attrs.multiple) {
        value.value = [option.value[0][props.valueField]]
      } else {
        value.value = option.value[0][props.valueField]
      }
    }
    props.onSuccess && props.onSuccess(data)
  } catch (error) {
    console.error(error)
  }
}


onMounted(async () => {
  if (props.isImmediate ?? true) {
    load()
  }
})
watch(
  () => props.params,
  () => {
    if ((props.isImmediate ?? true) && !isEqual(props.params, hisParmas.value)) {
      load()
      hisParmas.value = props.params
    }
  },
  { deep: true }
)

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
