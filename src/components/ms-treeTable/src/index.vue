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
            <ms-button type="primary" icon="Search" v-if="propsRef.isSearchBtn" @click="load">{{ getI18nValue('btn.query') }}</ms-button>
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
        <el-table
          :data="tableData"
          border
          ref="tableRef"
          highlight-current-row
          class="w-full"
          :height="height"
          v-bind="$attrs"
          lazy
          :load="lazyLoad"
          :row-key="propsRef?.rowKey"
        >
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
      </section>
    </article>
  </main>
</template>
<script setup lang="ts">
import { useForm, MSForm, FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { getTableColumns, getTableColumn, getButtonArrts, hasShow } from './index'
import { useTreeTableEvents } from './hooks/useTreeTableEvents'
import { TableActionType, TableProps } from './types'
import { get, set } from '@/utils/cache'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { getViewportOffset } from '@/utils/domUtils'
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
const emits = defineEmits(['register'])
const tableRef = ref() //table 实例
const propsRef = ref<TableProps>() //hooks属性
const loading = ref(false) //加载效果
const height = ref() //高度
const tableData = ref<any[]>([]) //table数据
let tableDataMap: Record<any, any> = {} //tableMap数据
let extendTreeMap: Record<any, any> = new Map()
const isMore = ref(false) //展开查询条件
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
async function load() {
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

  if (propsRef.value?.api) {
    apiRequest(res)
  }
}
async function apiRequest(res: Record<string, any>) {
  const params = { ...res }

  try {
    loading.value = true
    const { data } = await unref(propsRef)?.api!(params).send()
    handleTableData(data)
    if (propsRef.value?.onSuccess) {
      propsRef.value?.onSuccess(data)
    }
    computeTableHeight()
  } catch (err) {
    tableData.value = []
  } finally {
    loading.value = false
  }
}
async function computeTableHeight() {
  if (!tableRef.value || !propsRef.value?.isAutoHeight) return
  const tableEl = tableRef.value['$el']
  const headEl = tableEl.querySelector('.el-table__header')

  const { bottomIncludeBody } = getViewportOffset(headEl)
  height.value = bottomIncludeBody - 18 - (propsRef.value?.resizeHeightOffset ?? 0) - (globalStore.global.footer ? 29 : 0)
}

async function reset() {
  if (propsRef.value?.resetParams) {
    await formMethods.resetFields(propsRef.value?.resetParams)
  } else {
    await formMethods.resetFields()
  }
  if (propsRef.value?.onResetSuccess) {
    const data = await formMethods.getValue()
    const newData = propsRef.value?.onResetSuccess(data)
    if (newData) {
      formMethods.setValue(newData)
    }
  }
  load()
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
} = useTreeTableEvents({
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
  isChildren,
  formGetValue: formMethods.getValue,
  formSetValue: formMethods.setValue,
  formUpdateFormColumn: formMethods.updateFormColumn
}
async function isChildren(id: any) {
  return !!tableDataMap[id]
}

function handleTableData(data: any[]) {
  tableData.value = []
  tableDataMap = {}
  const { id, pid, children } = propsRef.value?.treeOption as any
  const newData = treeList(data, children)
  for (let i = 0; i < newData.length; i++) {
    const d = newData[i]
    if (d[children] && d[children].length > 0) {
      d.hasChildren = true
    }
    d[children] = null
    if (!d[pid]) {
      tableData.value.push(d)
    } else {
      if (!tableDataMap[d[pid]]) {
        tableDataMap[d[pid]] = []
      }
      tableDataMap[d[pid]].push(d)
    }
  }
  extendTreeMap.forEach((item: any) => {
    if (tableDataMap[item[id]]) {
      tableRef.value.store.states.treeData.value[item[id]].loaded = false
      tableRef.value.store.states.treeData.value[item[id]].expand = false
      tableRef.value?.store.loadOrToggle(item)
    } else {
      if (tableRef.value.store.states.lazyTreeNodeMap.value[item[id]]) {
        delete tableRef.value.store.states.lazyTreeNodeMap.value[item[id]]
        delete tableRef.value.store.states.treeData.value[item[id]]
      }
      extendTreeMap.delete(item[id])
      tableRef.value.store.loadOrToggle(data)
    }
  })
}
function lazyLoad(row: any, _treeNode: unknown, resolve: (date: any[]) => void) {
  const { id } = propsRef.value?.treeOption as any
  extendTreeMap.set(row[id], row)
  if (tableDataMap[row[id]]) {
    resolve(tableDataMap[row[id]])
  } else {
    resolve([])
  }
}

// 在页面关闭或刷新之前，保存数据
window.addEventListener('beforeunload', () => {
  extendTreeMap.clear()
})
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
