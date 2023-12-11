<template>
  <el-radio-group>
    <el-radio :label="item[props.valueField]" v-for="(item, index) in props.option" :key="index" :disabled="item.disabled" :border="item.border">{{
      item[props.labelField]
    }}</el-radio>
  </el-radio-group>
</template>
<script setup lang="ts">
interface Props {
  option: any
  labelField?: string
  valueField?: string
}
const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value'
})
</script>
<style lang="scss" scoped></style>
