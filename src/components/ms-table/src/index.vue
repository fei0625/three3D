<template>
  <main class="ms-table">
    <article class="ms-table-header" v-if="slots.header">
      <slot name="header"></slot>
    </article>
    <article class="ms-table-search" v-if="propsRef?.searchColumns && propsRef.searchColumns.length > 0">
      <MSForm @register="formRegister">
        <template #[item]="scope" v-for="(item, index) in formSlots" :key="index">
          <slot :name="item" v-bind="scope"></slot>
        </template>
        <template #search>
          <section class="flex gap-x-3">
            <ms-button type="primary" icon="Search" v-if="propsRef.isSearchBtn" @click="load(true)">{{ getI18nValue('btn.query') }}</ms-button>
            <ms-button icon="Refresh" class="!ml-0" v-if="propsRef.isResetBtn" @click="reset">{{ getI18nValue('btn.reset') }}</ms-button>
            <div @click="handelMore" class="text-[--ms-more-color] cursor-pointer flex items-center" v-if="propsRef.isMore && getSearchForm(2).length > 3">
              {{ isMore ? getI18nValue('btn.merge') : getI18nValue('btn.expand') }}
              <ms-icon icon="ArrowRight" :class="isMore ? '-rotate-90' : 'rotate-90'" class="ml-1 transition-all"></ms-icon>
            </div>
          </section>
        </template>
      </MSForm>
    </article>
    <article class="ms-table-content">
      <section class="ms-table-content-toolbar" v-if="slots.toolbar">
        <slot name="toolbar"></slot>
      </section>
      <section class="ms-table-content-body" v-loading="loading">
        <el-table :data="tableData" border ref="tableRef" highlight-current-row class="w-full" :height="height" v-bind="$attrs">
          <template v-for="item in propsRef?.tableColumns" :key="item.prop">
            <el-table-column v-bind="getTableColumn(item)" v-if="item.type && item.type != 'expand'"></el-table-column>
            <el-table-column v-bind="getTableColumn(item)" v-else-if="item.type == 'expand'">
              <template #default="scope">
                <slot name="expand" :row="scope.row" :column="scope.column" :index="scope.$index"></slot>
              </template>
            </el-table-column>
            <el-table-column v-bind="getTableColumn(item)" v-else>
              <template #header="scope" v-if="item.slotHeader">
                <slot :name="item.slotHeader" :column="scope.column" :index="scope.$index"></slot>
              </template>
              <template #default="scope" v-if="item.slot">
                <slot :name="item.slot" :row="scope.row" :column="scope.column" :index="scope.$index"></slot>
              </template>
            </el-table-column>
          </template>
          <el-table-column
            :label="getI18nValue('common.operation')"
            fixed="right"
            :width="140"
            align="center"
            v-bind="propsRef?.actionConfig ?? {}"
            v-if="propsRef?.actionColumn && propsRef.actionColumn.length > 0"
          >
            <template #default="scope">
              <section>
                <template v-for="actionItem in propsRef.actionColumn" :key="actionItem.icon">
                  <ms-button
                    @click="actionItem.onClick(scope.row)"
                    v-bind="getButtonArrts(actionItem)"
                    v-if="hasShow(actionItem, scope.row)"
                    class="!ml-1 first:!ml-0"
                    >{{ actionItem.label }}</ms-button
                  >
                </template>
              </section>
            </template>
          </el-table-column>
          <template #empty>
            <div>
              <el-empty :image-size="100" />
            </div>
          </template>
        </el-table>
        <section class="flex justify-end mt-2.5" v-if="propsRef?.showPagination && tableData.length > 0">
          <ms-pagination :total="total" v-model="pagination"></ms-pagination>
        </section>
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import { useForm, MSForm, FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { getTableColumns, getTableColumn, getButtonArrts, hasShow } from './index'
import { useTableEvents } from './hooks/useTableEvents'
import { TableActionType, TableProps } from './types'
import { get, set } from '@/utils/cache'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { getViewportOffset } from '@/utils/domUtils'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
interface Pagination {
  current: number
  size: number
}
const emits = defineEmits(['register'])
const tableRef = ref() //table 实例
const propsRef = ref<TableProps>() //hooks属性
const loading = ref(false) //加载效果
const height = ref() //高度
const tableData = ref<any[]>([]) //table数据
const isMore = ref(false) //展开查询条件
const pagination = ref<Pagination>({ current: 1, size: 20 }) //page分页
const total = ref<number>(0) //总条数
const searchFlage = ref(true) //查询或者重置的时候需要用到防止请求两次接口
const slots = useSlots() //插槽
const formSlots = Object.keys(slots).filter(item => item.includes('form-'))
const { register: formRegister, methods: formMethods } = useForm()

async function setProps(props: TableProps) {
  if (isRef(props.tableColumns)) {
    throw new Error('tableColumns不支持ref')
  }
  propsRef.value = deepCopy(props)

  getTableColumns(propsRef.value.tableColumns)

  if (propsRef.value?.isSearchBtn ?? true) {
    propsRef.value['isSearchBtn'] = true
  }
  if (propsRef.value?.isResetBtn ?? true) {
    propsRef.value['isResetBtn'] = true
  }
  if (propsRef.value?.isMore ?? true) {
    propsRef.value['isMore'] = true
  } else {
    isMore.value = true
  }
  if (!propsRef.value?.extrasSearchParams) {
    propsRef.value['extrasSearchParams'] = {}
  }
  if (propsRef.value?.searchColumns && propsRef.value.searchColumns.length > 0) {
    let parmas = {}
    if (propsRef.value.cacheName) {
      const staff = get(CacheEnumKey.STAFF)
      const cacheName = get(staff.staffCode + '_' + propsRef.value.cacheName)
      if (cacheName) {
        const { isMore: more, ...obj } = cacheName
        parmas = obj
        isMore.value = more
      }
    }
    await setFrom(parmas)
  }
  if (propsRef.value?.isImmediate ?? true) {
    await load()
  }
  computeTableHeight()
  window.addEventListener('resize', computeTableHeight)
}
async function load(isResetpagination?: boolean) {
  let res = { ...propsRef.value?.extrasSearchParams }
  //获取搜索框的查询参数
  if (propsRef.value?.searchColumns && propsRef.value.searchColumns.length > 0) {
    const data = await formMethods.getValue()
    res = { ...res, ...data }
  }
  if (propsRef.value?.onBeforeLoad) {
    const data = propsRef.value.onBeforeLoad({ ...res })
    if (data) {
      res = data
    }
  }
  if (propsRef.value?.cacheName) {
    const staff = get(CacheEnumKey.STAFF)
    set(staff.staffCode + '_' + propsRef.value.cacheName, { ...res, isMore: isMore.value })
  }
  if (isResetpagination) {
    pagination.value.current = 1
    searchFlage.value = true
  }
  if (propsRef.value?.api) {
    apiRequest(res)
  }
  if (propsRef.value?.tableData && !propsRef.value?.api) {
    if (propsRef.value?.showPagination) {
      const t = pagination.value.current * pagination.value.size - pagination.value.size
      tableData.value = propsRef.value?.tableData.slice(t, t + pagination.value.size)
      total.value = propsRef.value?.tableData.length
    } else {
      tableData.value = unref(propsRef)?.tableData
    }
    if (propsRef.value?.onSuccess) {
      propsRef.value?.onSuccess(tableData)
    }
    searchFlage.value = true
  }
}
async function apiRequest(res: Record<string, any>) {
  let params = { ...res }
  if (propsRef.value?.showPagination) {
    params = Object.assign({}, params, {
      page: pagination.value.current,
      pageSize: pagination.value.size
    })
  }

  try {
    loading.value = true
    const { data } = await unref(propsRef)?.api!(params).send()
    if (Array.isArray(data)) {
      tableData.value = data
    } else {
      tableData.value = data.records
    }
    if (propsRef.value?.showPagination) {
      total.value = data.total
    }
    if (propsRef.value?.onSuccess) {
      propsRef.value?.onSuccess(tableData.value)
    }
    computeTableHeight()
  } catch (err) {
    tableData.value = []
  } finally {
    loading.value = false
    searchFlage.value = true
  }
}
async function computeTableHeight() {
  if (!tableRef.value || !propsRef.value?.isAutoHeight) return
  const tableEl = tableRef.value['$el']
  const headEl = tableEl.querySelector('.el-table__header')

  const { bottomIncludeBody } = getViewportOffset(headEl)
  height.value =
    bottomIncludeBody -
    (propsRef.value?.showPagination && tableData.value.length > 0 ? 52 : 18) -
    (propsRef.value?.resizeHeightOffset ?? 0) -
    (globalStore.global.footer ? 29 : 0)
}

async function reset() {
  if (propsRef.value?.resetParams) {
    await formMethods.resetFields(propsRef.value?.resetParams)
  } else {
    await formMethods.resetFields()
  }
  if (propsRef.value?.onResetSuccess) {
    let data = await formMethods.getValue()
    let newData = propsRef.value?.onResetSuccess(data)
    if (newData) {
      formMethods.setValue(newData)
    }
  }
  load(true)
}
async function handelMore() {
  isMore.value = !isMore.value
  await setFrom()
  computeTableHeight()
}
async function setFrom(parmas?: Record<string, any>) {
  if (propsRef.value?.searchColumns) {
    await formMethods.setProps({
      formColumns: getSearchForm(isMore.value ? 2 : 1),
      colProps: propsRef.value?.formColProps ?? { xs: 24, sm: 12, md: 8, lg: 4, xl: 4 },
      gutter: 20,
      inline: true
    })
    formMethods.setValue(parmas ?? {})
  }
}
/**
 * 1 返回查询数组 2返回更多帅选数组
 */
function getSearchForm(type: number): FormColumn[] {
  let hiddenArr: FormColumn[] = []
  let arr: FormColumn[] = []
  if (propsRef.value?.searchColumns && propsRef.value.searchColumns.length > 0) {
    hiddenArr = propsRef.value?.searchColumns.filter((item: FormColumn) => item.componentProps?.type == 'hidden')
    arr = propsRef.value?.searchColumns.filter((item: FormColumn) => item.componentProps?.type != 'hidden')
  }
  return type == 1 ? [...hiddenArr, ...arr.slice(0, 3)] : [...hiddenArr, ...arr]
}
const {
  clearSelection,
  getSelectionRows,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  doLayout,
  sort,
  scrollTo,
  setScrollLeft,
  setScrollTop
} = useTableEvents({
  tableRef
})
const tableAction: TableActionType = {
  setProps,
  clearSelection,
  getSelectionRows,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  doLayout,
  sort,
  scrollTo,
  setScrollLeft,
  setScrollTop,
  load,
  computeTableHeight,
  formGetValue: formMethods.getValue,
  formSetValue: formMethods.setValue,
  formUpdateFormColumn: formMethods.updateFormColumn
}

watch(
  pagination,
  () => {
    if (searchFlage.value) {
      load()
    }
  },
  { deep: true }
)

onMounted(() => {
  emits('register', tableAction)
})
onUnmounted(() => {
  window.removeEventListener('resize', computeTableHeight)
})
watch([() => globalStore.global.footer, () => globalStore.global.tabs], () => {
  computeTableHeight()
})
defineOptions({
  inheritAttrs: false
})
</script>
<style lang="scss" scoped src="./styles.scss"></style>
