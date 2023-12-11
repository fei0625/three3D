import type { FormItemRule, ColProps, FormValidationResult } from 'element-plus'
export type ComponentType =
  | 'Input'
  | 'InputPassword'
  | 'InputTextArea'
  | 'InputNumber'
  | 'DatePicker'
  | 'RadioGroup'
  | 'Select'
  | 'ApiSelect'
  | 'TimePicker'
  | 'ApiSelectTree'
  | 'Switch'
  | 'CheckboxGroup'
  | 'IconPicker'
  | 'ImageUpload'
  | 'Tinymce'

export interface FormColumn {
  //自定义插槽
  slot?: string
  // 字段属性名
  prop: string
  // 标签上显示的自定义内容
  label?: string
  //组件
  component: ComponentType
  // 子组件 属性
  componentProps?: any | ((data: { formAction: FormActionType; model: Record<string, any> }) => any)
  //label宽度
  labelWidth?: string | number
  //是否必填
  required?: boolean
  //组件大小
  size?: 'large' | 'default' | 'small'
  //默认值
  defaultValue?: any
  //是否隐藏
  ifShow?: boolean | ((data: { model: Record<string, any> }) => boolean)
  //效验规则
  rules?: FormItemRule | FormItemRule[] | ((model: Record<string, any>) => FormItemRule | FormItemRule[])
  //Layout span最多24
  colProps?: Partial<ColProps>
  //左侧温馨提示Tooltip 组件
  tooltip?: string | Tooltip
  //分割线
  divider?: boolean
  //有侧文字
  suffix?: string
}

export interface FormProps {
  formColumns: FormColumn[]
  colProps?: Partial<ColProps> //删格子属性
  gutter?: number //间距
  inline?: boolean //是否开启行
  size?: 'large' | 'default' | 'small'
  disabled?: boolean
  labelWidth?: string | number
  labelPosition?: 'left' | 'right' | 'top'
  requireAsteriskPosition?: 'left' | 'right'
  hideRequiredAsterisk?: boolean
  inlineMessage?: boolean
  showMessage?: boolean
  labelSuffix?: string
}

export interface FormActionType {
  // 设置表单属性
  setProps: (props: FormProps) => void
  // 对整个表单作验证
  validate: () => Promise<void>
  // 对部分表单字段进行校验的方法
  validateField: (props: string[]) => FormValidationResult
  // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
  resetFields: (props?: string[]) => void
  // 滚动到指定表单字段
  scrollToField: (prop: string) => void
  // 清理指定字段的表单验证信息
  clearValidate: (props?: string[]) => void
  //读取数据
  getValue: () => any
  //设置数据
  setValue: (props: any) => void
  //设置单个数据
  setPropValue: (prop: string, value: any) => void
  //更新数据
  updateFormColumn: (props: Partial<FormColumn> | Partial<FormColumn>[]) => void
}

export interface NewFormColumn extends Omit<FormColumn, 'componentProps' | 'labelWidth' | 'required' | 'size' | 'rules' | 'tooltip' | 'ifShow'> {
  componentProps: any
  formItem: any
  tooltip: any
  ifShow: any
  // colClass: string
}
export interface UseFormActionContext {
  propsRef: Ref<FormProps | undefined>
  formRef: Ref<FormActionType | undefined>
  model: Ref<Record<string, any>>
  formColumnMap: Map<string, NewFormColumn>
  getFormColumns: (formColumns: FormColumn) => NewFormColumn
  modelIfShow: Ref<Record<string, number>>
}

export interface FormConfigProps extends Omit<FormProps, 'formColumns' | 'colProps' | 'gutter'> {}
