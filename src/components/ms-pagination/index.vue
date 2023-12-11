<template>
  <el-pagination
    layout="total, prev, pager, next, jumper, sizes"
    :page-size="modelValue.size"
    :current-page="modelValue.current"
    @current-change="currentChange"
    @size-change="sizeChange"
    background
    small
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: { current: number; size: number }
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => {
    return { current: 1, size: 10 }
  }
})
const currentChange = (value: number) => {
  props.modelValue.current = value
}
const sizeChange = (value: number) => {
  props.modelValue.size = value
}
</script>
<style scoped>
:deep(.el-input__inner) {
  padding: 0 3px !important;
}
</style>
