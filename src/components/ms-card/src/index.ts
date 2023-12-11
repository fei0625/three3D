import { hasPermission } from '@/utils/permission'
import { ActionItem, CardColumn } from './types'

export function getImageName(item: any, imageName: string | ((row: any) => string)) {
  let img = ''
  if (isType(imageName, 'String')) {
    img = item[imageName as keyof typeof item]
  } else if (typeof imageName === 'function') {
    img = imageName(item)
  }
  return img
}
export function getContent(cardItem: CardColumn, item: any) {
  let content = ''
  if (cardItem.formatter) {
    content = cardItem.formatter(item)
  } else if (cardItem.prop) {
    content = item[cardItem.prop]
  }
  return content
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
