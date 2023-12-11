import { hasPermission } from '@/utils/permission'
import { ActionItem, TableColumn } from './types'

//添加自定义属性
export const getTableColumns = (data: TableColumn[]) => {
  data.forEach((item: TableColumn) => {
    if (!item.type && !item.width) {
      item['minWidth'] = 150
    }
    if (item.showOverflowTooltip ?? true) {
      item['showOverflowTooltip'] = true
    }
  })
}
//获取头
export const getTableColumn = (tableColumn: TableColumn) => {
  const { slot, slotHeader, ...obj } = tableColumn
  return obj
}

export const getButtonArrts = (actionItem: ActionItem) => {
  const { onClick, ifShow, label, auth, ...obj } = actionItem
  return obj
}
export const hasShow = (actionItem: ActionItem, row: any) => {
  let isHide = true
  if (actionItem.auth) {
    isHide = false
    if (hasPermission(actionItem.auth)) {
      isHide = true
      if (typeof actionItem.ifShow === 'boolean') {
        isHide = actionItem.ifShow
      } else if (typeof actionItem.ifShow === 'function') {
        isHide = actionItem.ifShow(row)
      }
    }
  }
  return isHide
}
