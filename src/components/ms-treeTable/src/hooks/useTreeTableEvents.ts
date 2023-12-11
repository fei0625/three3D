import { Ref } from 'vue'
import { TableActionType } from '../types'

export interface UseTableActionContext {
  tableRef: Ref<TableActionType | undefined>
}

export const useTreeTableEvents = ({ tableRef }: UseTableActionContext) => {
  const clearSelection = () => {
    unref(tableRef)?.clearSelection()
  }
  const getSelectionRows = () => {
    return unref(tableRef)?.getSelectionRows()
  }
  const toggleRowSelection = (row: any, selected: boolean) => {
    unref(tableRef)?.toggleRowSelection(row, selected)
  }
  const toggleAllSelection = () => {
    unref(tableRef)?.toggleAllSelection()
  }
  const toggleRowExpansion = (row: any, expanded: boolean) => {
    unref(tableRef)?.toggleRowExpansion(row, expanded)
  }
  const setCurrentRow = (row: any) => {
    unref(tableRef)?.setCurrentRow(row)
  }
  const clearSort = () => {
    unref(tableRef)?.clearSort()
  }
  const clearFilter = (columnKeys: string[]) => {
    unref(tableRef)?.clearFilter(columnKeys)
  }
  const doLayout = () => {
    unref(tableRef)?.doLayout()
  }
  const sort = (prop: string, order: string) => {
    unref(tableRef)?.sort(prop, order)
  }
  const scrollTo = (options: number | ScrollToOptions, yCoord?: number | undefined) => {
    unref(tableRef)?.scrollTo(options, yCoord)
  }
  const setScrollLeft = (left?: number | undefined) => {
    unref(tableRef)?.setScrollLeft(left)
  }
  const setScrollTop = (top?: number | undefined) => {
    unref(tableRef)?.setScrollTop(top)
  }

  return {
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
  }
}
