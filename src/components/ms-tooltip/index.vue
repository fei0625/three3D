<template>
  <el-tooltip v-bind="getTooltip">
    <slot></slot>
  </el-tooltip>
</template>

<script setup lang="ts">
const props = defineProps<{ tooltip?: string | Tooltip }>()
const getTooltip = computed(() => {
  if (!props.tooltip) {
    return {}
  }
  if (isType(props.tooltip, 'Object')) {
    return props.tooltip as Record<string, any>
  } else {
    return {
      effect: 'dark',
      content: props.tooltip,
      placement: 'top',
      enterable: false
    }
  }
})
</script>
<style lang="scss" scoped></style>
