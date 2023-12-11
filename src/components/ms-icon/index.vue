<template>
  <ms-tooltip v-if="props.tooltip" :tooltip="props.tooltip">
    <el-icon size="12" v-bind="$attrs"><component :is="icon"></component> </el-icon>
  </ms-tooltip>
  <template v-else>
    <el-icon size="12" v-bind="$attrs"><component :is="icon"></component></el-icon>
  </template>
</template>

<script setup lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps<{ icon: string; tooltip?: string | Tooltip }>()
const icon = computed(() => (ElementPlusIconsVue as any)[props.icon])

defineOptions({
  inheritAttrs: false
})
</script>
<style lang="scss" scoped></style>
