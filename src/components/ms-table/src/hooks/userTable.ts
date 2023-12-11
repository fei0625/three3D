import { ref, onUnmounted, unref, watch } from 'vue'
import { TableProps, TableActionType } from '../types'
import { FormColumn } from '@/components/ms-form'

export default function useTable(props?: TableProps) {
  const tableAction = ref<TableActionType | null>(null)

  function register(instance: TableActionType) {
    onUnmounted(() => {
      tableAction.value = null
    })

    tableAction.value = instance
    // 监听 props， 若props改变了
    // 则使用 form 实例调用内部的 setProps 方法将新的props设置到form组件内部
    watch(
      () => props,
      () => {
        if (props) {
          instance.setProps(props)
        }
      },
      { immediate: true, deep: true }
    )
  }
  async function getTable() {
    await nextTick()
    const table = unref(tableAction)
    if (!table) {
      throw new Error('The table instance has not been obtained, please make sure that the form has been rendered when performing the form operation!')
    }
    await nextTick()
    return table as TableActionType
  }
  const methods: TableActionType = {
    setProps: async (props: TableProps) => {
      const table = await getTable()
      table.setProps(props)
    },
    load: async () => {
      const table = await getTable()
      table.load()
    },
    clearSelection: async () => {
      const table = await getTable()
      table.clearSelection()
    },
    getSelectionRows: async () => {
      const table = await getTable()
      return table.getSelectionRows()
    },
    toggleRowSelection: async (row: any, selected: boolean) => {
      const table = await getTable()
      table.toggleRowSelection(row, selected)
    },
    toggleAllSelection: async () => {
      const table = await getTable()
      table.toggleAllSelection()
    },
    toggleRowExpansion: async (row: any, expanded: boolean) => {
      const table = await getTable()
      table.toggleRowExpansion(row, expanded)
    },
    setCurrentRow: async (row: any) => {
      const table = await getTable()
      table.setCurrentRow(row)
    },
    clearSort: async () => {
      const table = await getTable()
      table.clearSort()
    },
    clearFilter: async (columnKeys: string[]) => {
      const table = await getTable()
      table.clearFilter(columnKeys)
    },
    doLayout: async () => {
      const table = await getTable()
      table.doLayout()
    },
    sort: async (prop: string, order: string) => {
      const table = await getTable()
      table.sort(prop, order)
    },
    scrollTo: async (options: number | ScrollToOptions, yCoord?: number | undefined) => {
      const table = await getTable()
      table.scrollTo(options, yCoord)
    },
    setScrollLeft: async (left?: number | undefined) => {
      const table = await getTable()
      table.setScrollLeft(left)
    },
    setScrollTop: async (top?: number | undefined) => {
      const table = await getTable()
      table.setScrollTop(top)
    },
    formGetValue: async () => {
      const table = await getTable()
      return table.formGetValue()
    },
    formSetValue: async (props: any) => {
      const table = await getTable()
      table.formSetValue(props)
    },

    formUpdateFormColumn: async (props: Partial<FormColumn> | Partial<FormColumn>[]) => {
      const table = await getTable()
      table.formUpdateFormColumn(props)
    },
    computeTableHeight: async () => {
      const table = await getTable()
      table.computeTableHeight()
    }
  }

  return { register, methods }
}
