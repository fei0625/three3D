import type { DialogProps as ElDialogProps } from 'element-plus'
export interface DialogProps extends Omit<Partial<ElDialogProps>, 'modelValue'> {
  isCancel?: boolean
  isConfirm?: boolean
  isMaxHeight?: boolean
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onOpenAutoFocus?: () => void
  onCloseAutoFocus?: () => void
}

export interface DialogActionType {
  // 设置表格属性
  setProps: (props: DialogProps) => void
  setIsVisible: (flag: boolean) => void
  setConfirmLoading: (flag: boolean) => void
}
