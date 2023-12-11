import { getI18nValue } from '@/utils/i18n'
import { FormActionType, FormColumn, FormConfigProps, FormProps, NewFormColumn } from './types'
import { FormItemRule } from 'element-plus'
export const modelIfShow = ref<Record<string, number>>({}) //是否隐藏字段

/**
 * 读取组件属性
 */
export const getComponentProps = (item: FormColumn, formAction: FormActionType, model: Ref<Record<string, any>>) => {
  let componentProp: any = {}
  if (isType(item.componentProps, 'Object')) {
    componentProp = item.componentProps ?? {}
  } else if (typeof item.componentProps === 'function') {
    componentProp = item.componentProps({ formAction, model: unref(model) }) ?? {}
  }
  if (['Input', 'InputPassword', 'InputTextArea', 'InputNumber', 'ApiSelect', 'ApiSelectTree', 'Select'].includes(item.component)) {
    componentProp.placeholder = componentProp.placeholder ?? (item.label || '')
    if (item.component != 'InputNumber') componentProp.clearable = componentProp.clearable ?? true
  }

  if ('DatePicker' == item.component && !componentProp.type) {
    componentProp.placeholder = getI18nValue('form.date')
  }

  if (componentProp.type) {
    if (['date', 'daterange', 'monthrange', 'month', 'datetime', 'datetimerange'].includes(componentProp.type)) {
      componentProp.clearable = componentProp.clearable ?? true

      if (componentProp.type == 'data') {
        componentProp.placeholder = componentProp.placeholder ?? getI18nValue('form.date')
      }
      if (componentProp.type == 'daterange') {
        componentProp.startPlaceholder = componentProp.startPlaceholder ?? getI18nValue('form.startDate')
        componentProp.endPlaceholder = componentProp.endPlaceholder ?? getI18nValue('form.endDate')
      }
      if (componentProp.type == 'month') {
        componentProp.placeholder = componentProp.placeholder ?? getI18nValue('form.moon')
      }
      if (componentProp.type == 'monthrange') {
        componentProp.startPlaceholder = componentProp.startPlaceholder ?? getI18nValue('form.startMonth')
        componentProp.endPlaceholder = componentProp.endPlaceholder ?? getI18nValue('form.endMonth')
      }
      if (componentProp.type == 'datetime') {
        componentProp.placeholder = componentProp.placeholder ?? getI18nValue('form.time')
      }
      if (componentProp.type == 'datetimerange') {
        componentProp.startPlaceholder = componentProp.startPlaceholder ?? getI18nValue('form.startTime')
        componentProp.endPlaceholder = componentProp.endPlaceholder ?? getI18nValue('form.endTime')
      }
    }
  }

  return componentProp
}

/**
 * 读取formItem属性
 */
export const getFormItem = (item: FormColumn, componentProp: any, model: Ref<Record<string, any>>) => {
  const { slot, component, componentProps, required, defaultValue, ifShow, rules, colProps, tooltip, divider, suffix, ...obj } = item
  let rule = rules as FormItemRule | FormItemRule[]
  if (typeof rules == 'function') {
    rule = rules(unref(model))
  }
  if (required && !rules) {
    let message = ''
    if (componentProp?.placeholder) {
      message = componentProp?.placeholder
    }
    if (component == 'InputNumber') {
      rule = [
        {
          required: true,
          message,
          trigger: 'blur'
        },
        {
          validator: sizeValidate()
        }
      ]
    } else {
      rule = {
        required: true,
        message,
        trigger: 'blur'
      }
    }
  }
  return { rules: rule, ...obj }
}
/**
 * 读取col属性
 */
export const getCol = (item: FormColumn, propsRef: Ref<FormProps | undefined>) => {
  let obj = {}
  if (unref(propsRef)?.inline) {
    if (unref(propsRef)?.colProps) {
      if (item.component == 'DatePicker' && !item.colProps) {
        item.colProps = { xs: 24, sm: 16, md: 12, lg: 8, xl: 8 }
      }
      obj = { ...unref(propsRef)?.colProps, ...item.colProps }
    } else {
      obj = item.colProps ?? { span: 4 }
    }
  } else {
    obj = { span: 24 }
  }

  return obj
}

/**
 * 显示隐藏
 */
export const getIfShow = (item: NewFormColumn, model: Record<string, any>) => {
  let show = true
  if (item.ifShow == false) {
    show = false
  }
  if (item.componentProps && item.componentProps['type'] == 'hidden') {
    show = false
  }
  if (typeof item.ifShow === 'function') {
    const isHide = item.ifShow({ model: unref(model) })
    show = isHide
  }
  if (show) {
    modelIfShow.value[item.prop] = 1
  } else {
    modelIfShow.value[item.prop] = 0
  }
  if (item.componentProps && item.componentProps['type'] == 'hidden') {
    modelIfShow.value[item.prop] = 1
  }
  return show
}

export const getDivider = (formProps: FormConfigProps, item: NewFormColumn) => {
  let obj: Record<string, string | number> = {
    width: 0,
    marginLeft: 0
  }
  if (!formProps.labelWidth && !item.formItem.labelWidth) {
    return {}
  }
  if (formProps.labelWidth) {
    obj.width = `calc(100% - ${formProps.labelWidth})`
    obj.marginLeft = formProps.labelWidth
  }
  if (item.formItem.labelWidth) {
    obj.width = `calc(100% - ${item.formItem.labelWidth})`
    obj.marginLeft = item.formItem.labelWidth
  }

  return obj
}
