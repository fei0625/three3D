<template>
  <el-form ref="formRef" :model="model" @submit.prevent v-bind="formProps">
    <el-row :gutter="propsRef?.gutter ?? 0">
      <template v-for="item in formColumnList" :key="item.prop">
        <el-col v-bind="item.colProps" v-show="getIfShow(item, model)">
          <el-form-item
            :key="item.prop"
            :class="[item.label ? '' : 'label', formProps.inline ? ' w-full !mr-0' : '']"
            v-bind="item.formItem"
            :required="modelIfShow[item.prop] == 1 && item.formItem.rules ? true : false"
          >
            <template #label="label">
              <span v-if="label.label">
                <ms-tooltip v-if="item.tooltip" :tooltip="item.tooltip">
                  <ms-icon icon="QuestionFilled" class="align-middle"></ms-icon>
                </ms-tooltip>
                {{ label.label }}
              </span>
            </template>
            <template v-if="item.slot">
              <slot :model="model" :prop="item.prop" :name="item.slot"></slot>
            </template>
            <component
              :is="componentMap.get(item.component)"
              v-else
              v-model="model[item.prop]"
              :disabled="formProps.disabled"
              v-bind="item.componentProps"
              :class="item.component != 'InputNumber' ? 'flex-1' : ''"
            ></component>
            <span class="ml-2 text-[#666]" v-if="item.suffix">{{ item.suffix }}</span>
          </el-form-item>
          <el-divider v-if="item.divider" class="!mb-[18px] !mt-0" :style="getDivider(formProps, item)" />
        </el-col>
      </template>
      <div class="pr-5 mb-[18px] ml-auto" v-if="slots.search">
        <slot name="search"></slot>
      </div>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import { getCol, getComponentProps, getFormItem, getIfShow, getDivider, modelIfShow } from './index'
import { componentMap } from './componentMap'
import { useFormEvents } from './hooks/useFormEvents'
import { FormActionType, FormColumn, FormConfigProps, FormProps, NewFormColumn } from './types'

const emits = defineEmits(['register'])
const propsRef = ref<FormProps>() //hooks属性
const formRef = ref() //form 实例
const formColumnMap = reactive<Map<string, NewFormColumn>>(new Map<string, NewFormColumn>()) // formItemMap
const formColumnList = computed<NewFormColumn[]>(() => Array.from(formColumnMap.values())) //formItemList

const formProps = ref({} as FormConfigProps) //表单属性
const slots = useSlots()
const model = ref<any>({}) //表单字段

function setProps(props: FormProps) {
  if (isRef(props.formColumns)) {
    throw new Error('formColumns不支持ref')
  }
  formColumnMap.clear()
  model.value = {}
  formProps.value = {}
  propsRef.value = undefined
  propsRef.value = deepCopy(props)
  const { formColumns, colProps, gutter, ...formPropsAttr } = propsRef.value
  formProps.value = formPropsAttr
  if (!propsRef.value.formColumns) {
    return
  }
  for (let i = 0; i < propsRef.value.formColumns.length; i++) {
    const d: FormColumn = propsRef.value.formColumns[i]
    const newFormColumn = getFormColumns(d)
    formColumnMap.set(d.prop, newFormColumn)
    model.value[d.prop] = model.value[d.prop] ?? d.defaultValue
  }
}
const getFormColumns = (formColumns: FormColumn) => {
  let newFormColumn = {} as NewFormColumn
  newFormColumn['componentProps'] = getComponentProps(formColumns, formAction, model)
  newFormColumn['formItem'] = getFormItem(formColumns, newFormColumn['componentProps'], model)
  newFormColumn['colProps'] = getCol(formColumns, propsRef)
  newFormColumn['ifShow'] = formColumns.ifShow
  newFormColumn['defaultValue'] = formColumns.defaultValue
  newFormColumn['component'] = formColumns.component
  newFormColumn['prop'] = formColumns.prop
  newFormColumn['label'] = formColumns.label
  newFormColumn['tooltip'] = formColumns.tooltip
  newFormColumn['slot'] = formColumns.slot
  newFormColumn['suffix'] = formColumns.suffix
  newFormColumn['divider'] = formColumns.divider
  modelIfShow.value[formColumns.prop] = 1

  return newFormColumn
}
const { resetFields, clearValidate, validate, validateField, scrollToField, getValue, setValue, updateFormColumn, setPropValue } = useFormEvents({
  propsRef,
  model,
  formRef,
  modelIfShow,
  formColumnMap,
  getFormColumns
})

const formAction: FormActionType = {
  setProps,
  validate,
  validateField,
  resetFields,
  scrollToField,
  clearValidate,
  getValue,
  setValue,
  setPropValue,
  updateFormColumn
}

onMounted(() => {
  emits('register', formAction)
})
onUnmounted(() => {
  modelIfShow.value = {}
})
</script>
<style lang="scss" scoped>
.label > :deep(.el-form-item__label) {
  @apply p-0;
}
</style>
