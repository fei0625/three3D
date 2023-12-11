<template>
  <el-checkbox-group>
    <el-checkbox :label="item.value" v-for="(item, index) in props.option" :key="index" :disabled="item.disabled" :value="item[props.valueField]">{{
      item[props.labelField]
    }}</el-checkbox>
  </el-checkbox-group>
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
