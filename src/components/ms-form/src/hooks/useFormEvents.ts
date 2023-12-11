import { FormColumn, UseFormActionContext } from '../types'
import { FormValidationResult } from 'element-plus'

export function useFormEvents({ formRef, propsRef, model, formColumnMap, getFormColumns, modelIfShow }: UseFormActionContext) {
  function resetFields(props?: string[]) {
    if (props) {
      for (const key in model.value) {
        if (!props.includes(key)) {
          let data = formColumnMap.get(key)
          if (data) {
            model.value[data.prop] = data.defaultValue
          }
        }
      }
    } else {
      unref(formRef)?.resetFields(props)
    }
  }

  function clearValidate(prop?: string[]) {
    unref(formRef)?.clearValidate(prop)
  }

  async function validate() {
    return unref(formRef)?.validate()
  }

  function validateField(prop: string[]) {
    return unref(formRef)?.validateField(prop) as FormValidationResult
  }

  function scrollToField(prop: string) {
    unref(formRef)?.scrollToField(prop)
  }
  function getValue() {
    let obj: any = {}
    for (const key in unref(model)) {
      const k = unref(model)[key]
      if (modelIfShow.value[key]) {
        obj[key] = k
      }
    }
    return obj
  }
  function setValue(props: any) {
    for (const key in unref(model)) {
      const k = unref(model)[key]
      model.value[key] = props[key] ?? k
    }
  }
  function setPropValue(prop: string, value: any) {
    if (Object.keys(unref(model)).includes(prop)) {
      model.value[prop] = value
    } else {
      throw new Error('The corresponding key was not found!')
    }
  }
  function updateFormColumn(props: Partial<FormColumn> | Partial<FormColumn>[]) {
    let updateDataMap: Map<string, FormColumn> = new Map()
    let getSchema = deepCopy(unref(propsRef)?.formColumns) as FormColumn[]

    if (isType(props, 'Object')) {
      updateDataMap.set((props as FormColumn).prop, props as FormColumn)
    } else if (Array.isArray(props)) {
      props.forEach(item => {
        if (item.prop) updateDataMap.set(item.prop, item as FormColumn)
      })
    }

    getSchema.forEach((val: any) => {
      let _val = updateDataMap.get(val.prop)
      if (_val) {
        let newSchema = deepMerge(val, _val)
        newSchema = getFormColumns(newSchema)
        formColumnMap.set(newSchema.prop, newSchema)
      }
    })
  }

  return { resetFields, clearValidate, validate, validateField, scrollToField, getValue, setValue, updateFormColumn, setPropValue }
}
