import { getI18nValue } from '@/utils/i18n'
import { ElMessageBox, ElMessageBoxOptions } from 'element-plus'

export class useMessageBox {
  public MessageBox(props: ElMessageBoxOptions) {
    let obj = {
      autofocus: false,
      title: getI18nValue('common.info'),
      showCancelButton: true,
      callback() {},
      closeOnPressEscape: false,
      closeOnClickModal: false
    }
    obj = Object.assign({}, obj, props)
    ElMessageBox(obj)
  }
}
