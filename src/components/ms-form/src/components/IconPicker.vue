<template>
  <section class="flex w-full">
    <el-input :placeholder="getI18nValue('form.selectIcon')" type="text" clearable v-model="IcoValue" class="h-full" />
    <el-popover
      placement="bottom-start"
      :width="300"
      trigger="click"
      :fallback-placements="['bottom-start', 'bottom', 'top', 'right', 'left']"
      v-model:visible="visible"
    >
      <el-input :prefix-icon="ElementPlusIconsVue['Search']" type="text" clearable v-model="search" />
      <div v-if="IconArr.length > 0" class="h-[220px] icon-box">
        <div v-for="(value, index) in newIconArr" :key="index" class="icon w-[12.6%] h-[12.6%]" @click="onSelect(value)">
          <el-icon>
            <component :is="getIcon(value)"></component>
          </el-icon>
        </div>
      </div>
      <el-empty v-else class="h-[220px]" />
      <ms-pagination
        layout="total,prev, pager, next"
        v-if="IconArr.length > 0"
        :total="total"
        v-model="page"
        small
        :page-sizes="[60, 120, 320]"
        class="mt-2"
      ></ms-pagination>
      <template #reference>
        <button type="button" class="icon-btn">
          <ms-icon v-if="getIcon(selectIcon)" :icon="selectIcon"></ms-icon>
          <div v-else class="w-4 h-4 bg-gray-200 rounded-full"></div>
        </button>
      </template>
    </el-popover>
  </section>
</template>
<script setup lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { getI18nValue } from '@/utils/i18n'

interface Page {
  current: number
  size: number
}
const props = withDefaults(defineProps<{ modelValue: string }>(), {
  modelValue: ''
})
const visible = ref(false)
const emits = defineEmits(['update:modelValue'])
let IconArr = ref<string[]>(Object.keys(ElementPlusIconsVue))
let newIconArr = ref<string[]>()
let selectIcon = ref<string>(props.modelValue ? props.modelValue : 'Setting')
let IcoValue = ref<string>(props.modelValue)
let page = ref<Page>({ current: 1, size: 60 })
let total = ref<number>(IconArr.value.length)
let search = ref<string>('')

function loadIcon() {
  let t = page.value.current * page.value.size - page.value.size
  newIconArr.value = IconArr.value.slice(t, t + page.value.size)
}
loadIcon()
const getIcon = (icon: string) => {
  return (ElementPlusIconsVue as any)[icon]
}
function onSelect(icon: string) {
  IcoValue.value = icon
  visible.value = false
}
/**
 * 监听page分页
 */
watch(
  page,
  () => {
    loadIcon()
  },
  { deep: true }
)
/**
 * 监听搜索框
 */
watch(
  search,
  () => {
    IconArr.value = Object.keys(ElementPlusIconsVue).filter(item => item.indexOf(search.value) != -1)
    total.value = IconArr.value.length
    loadIcon()
  },
  { deep: true }
)
/**
 * 监听input
 */
watch(
  IcoValue,
  () => {
    emits('update:modelValue', IcoValue.value)
    selectIcon.value = IcoValue.value
    if (!IcoValue.value) {
      selectIcon.value = 'Setting'
    }
  },
  { deep: true }
)
/**
 * 监听 props变化
 */
watch(
  () => props.modelValue,
  () => {
    IcoValue.value = props.modelValue
  }
)
</script>
<style lang="scss" scoped>
:deep(.el-input__inner),
:deep(.el-input__wrapper) {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.icon-box {
  @apply flex flex-wrap overflow-auto mt-1 content-start;
  .icon {
    @apply p-2 cursor-pointer mr-1 mt-1 flex justify-center items-center border border-solid hover:border-blue-400;
  }
}
.icon-btn {
  @apply bg-gray-100 border-solid border border-gray-200 px-2 py-1 flex justify-center items-center border-l-0;
}
</style>
