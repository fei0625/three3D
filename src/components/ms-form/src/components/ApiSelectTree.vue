<template>
  <el-tree-select v-model="value" :data="treeData" :render-after-expand="false" check-strictly filterable />
</template>

<script setup lang="ts">
import { isEqual } from 'lodash-es'
interface Props {
  api: Function
  params?: any
  props: {
    label: string
    children: string
    value: string
  }
  isImmediate?: boolean
  modelValue: any
  onSuccess?: (data: any[]) => void
}
interface Data {
  label: string
  value: number | string
  children: Data[]
}
const props = withDefaults(defineProps<Props>(), {
  isImmediate: true
})
const emits = defineEmits(['update:modelValue'])
let value = ref(props.modelValue)
let hisParmas = ref(props.params)
let treeData = ref<any[]>([])
async function load() {
  try {
    let { data } = await props.api(props.params).send()
    if (Array.isArray(data)) {
      treeData.value = handleData(data)
    } else {
      treeData.value = handleData(data.records)
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
function handleData(data: any[]): Data[] {
  let arr = []
  for (let i = 0; i < data.length; i++) {
    let obj = {} as Data
    obj['label'] = data[i][props.props.label]
    obj['value'] = data[i][props.props.value]
    if (data[i][props.props.children]) {
      obj['children'] = handleData(data[i][props.props.children])
    } else {
      obj['children'] = []
    }
    arr.push(obj)
  }
  return arr
}
watch(value, v => {
  emits('update:modelValue', v)
})
watch(
  () => props.modelValue,
  v => {
    value.value = v
  }
)
</script>
<style lang="scss" scoped></style>
