import { ref, onUnmounted, unref, watch } from 'vue'
import { DialogProps, DialogActionType } from '../types'

export default function useDialog(props?: DialogProps) {
  const dialogAction = ref<DialogActionType | null>(null)
  function register(instance: DialogActionType) {
    onUnmounted(() => {
      dialogAction.value = null
    })
    dialogAction.value = instance
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
  function getDialog() {
    const dialog = unref(dialogAction)
    if (!dialog) {
      throw new Error('The dialog instance has not been obtained, please make sure that the form has been rendered when performing the form operation!')
    }
    return dialog as DialogActionType
  }
  const methods: DialogActionType = {
    setProps: (props: DialogProps) => {
      const dialog = getDialog()
      dialog.setProps(props)
    },
    setIsVisible: (flag: boolean) => {
      const dialog = getDialog()
      dialog.setIsVisible(flag)
    },
    setConfirmLoading: (flag: boolean) => {
      const dialog = getDialog()
      dialog.setConfirmLoading(flag)
    }
  }

  return { register, methods }
}
