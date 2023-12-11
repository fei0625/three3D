import { ref, onUnmounted, unref, watch } from 'vue'
import { FormActionType, FormColumn, FormProps } from '../types'

export default function useForm(props?: FormProps) {
  const formAction = ref<FormActionType | null>(null)

  function register(instance: FormActionType) {
    onUnmounted(() => {
      formAction.value = null
    })

    formAction.value = instance
    // 监听 props， 若props改变了
    // 则使用 form 实例调用内部的 setProps 方法将新的props设置到form组件内部
    watch(
      () => props,
      () => {
        if (props) {
          props && instance.setProps(props)
        }
      },
      { immediate: true, deep: true }
    )
  }
  async function getForm() {
    await nextTick()
    const form = unref(formAction)
    if (!form) {
      throw new Error('The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!')
    }
    await nextTick()
    return form as FormActionType
  }
  const methods: FormActionType = {
    setProps: async (props: FormProps) => {
      const form = await getForm()
      form.setProps(props)
    },
    validate: async () => {
      const form = await getForm()
      return form.validate()
    },
    validateField: async (props: string[]) => {
      const form = await getForm()
      return form.validateField(props)
    },
    resetFields: async (props?: string[]) => {
      const form = await getForm()
      form.resetFields(props)
    },
    scrollToField: async (prop: string) => {
      const form = await getForm()
      form.scrollToField(prop)
    },
    clearValidate: async (props?: string[]) => {
      const form = await getForm()
      form.clearValidate(props)
    },
    getValue: async () => {
      const form = await getForm()
      return form.getValue()
    },
    setValue: async (props: any) => {
      const form = await getForm()
      form.setValue(props)
    },
    setPropValue: async (prop: string, value: any) => {
      const form = await getForm()
      form.setPropValue(prop, value)
    },

    updateFormColumn: async (props: Partial<FormColumn> | Partial<FormColumn>[]) => {
      const form = await getForm()
      form.updateFormColumn(props)
    }
  }

  return { register, methods }
}
