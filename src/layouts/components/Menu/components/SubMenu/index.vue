<template>
  <el-sub-menu :index="props.data.path" v-if="props.data.children && props.data.children.length > 0">
    <template #title>
      <div class="sub-menu-item">
        <ms-icon :icon="props.data.meta.icon" v-if="props.data.meta.icon" :size="12"></ms-icon>
        <ms-tooltip :tooltip="getI18nNoUnknownValue(props.data.meta.title)" :disabled="tipsMap[props.data.path]">
          <div @mousemove="mousemove(props.data.path)">
            {{ getI18nNoUnknownValue(props.data.meta.title) }}
          </div>
        </ms-tooltip>
      </div>
    </template>
    <subMenu :data="cItem" v-for="(cItem, cIndex) in props.data.children" :key="cIndex"></subMenu>
  </el-sub-menu>
  <el-menu-item @click="onClick(props.data)" :index="props.data.path" v-if="!props.data.children && props.data.meta.hideMenu == '1'">
    <ms-icon :icon="props.data.meta.icon" v-if="props.data.meta.icon" :size="12"></ms-icon>
    <template #title>
      <ms-tooltip :tooltip="getI18nNoUnknownValue(props.data.meta.title)" :disabled="tipsMap[props.data.path]">
        <div class="menu-item" @mousemove="mousemove(props.data.path)">
          <div>{{ getI18nNoUnknownValue(props.data.meta.title) }}</div>
        </div>
      </ms-tooltip>
    </template>
  </el-menu-item>
</template>
<script setup lang="ts">
import { AppRouteRecordRaw } from '@/router/types'
import { getI18nNoUnknownValue } from '@/utils/i18n/index'
defineOptions({
  name: 'SubMenu'
})
const props = defineProps<{
  data: AppRouteRecordRaw
}>()

const router = useRouter()
const tipsMap = ref<Record<string, boolean>>({})
function mousemove(path: string) {
  if (Object.keys(tipsMap.value).includes(path)) {
    return
  }
  let dom = event?.target as HTMLElement
  tipsMap.value[path] = dom.scrollWidth > dom.offsetWidth ? false : true
}
function onClick(menu: AppRouteRecordRaw) {
  if (/^https?:/.test(menu.path)) {
    window.open(menu.path, '_black')
  } else {
    router.push(menu.path)
  }
}
</script>
