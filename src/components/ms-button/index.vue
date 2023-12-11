<template>
  <ms-tooltip :tooltip="props.tooltip" :disabled="!props.tooltip" v-if="isHide">
    <el-button v-bind="$attrs" :icon="icon" :loading-icon="loadingIcon"><slot></slot></el-button>
  </ms-tooltip>
</template>
<script setup lang="ts">
import { hasPermission } from '@/utils/permission'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

interface Props {
  // 权限编码控制是否显示
  auth?: string | string[]
  // 业务控制是否显示
  tooltip?: string | Tooltip
  icon?: string
  loadingIcon?: string
}
const props = defineProps<Props>()
const isHide = ref(true)
const icon = computed(() => {
  if (props.icon) {
    return (ElementPlusIconsVue as any)[props.icon]
  } else {
    return ''
  }
})
const loadingIcon = computed(() => {
  if (props.icon) {
    return (ElementPlusIconsVue as any)[props.icon]
  } else {
    return ElementPlusIconsVue['Loading']
  }
})

function hasShow() {
  if (props.auth) {
    isHide.value = false
    if (hasPermission(props.auth)) {
      isHide.value = true
    }
  }
}
onMounted(() => {
  hasShow()
})

defineOptions({
  inheritAttrs: false
})
</script>
