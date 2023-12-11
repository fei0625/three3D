import { ElInput, ElInputNumber, ElTimePicker, ElDatePicker, ElSwitch } from 'element-plus'
import InputPassword from './components/InputPassword.vue'
import InputTextArea from './components/InputTextArea.vue'
import RadioGroup from './components/RadioGroup.vue'
import Select from './components/Select.vue'
import ApiSelectTree from './components/ApiSelectTree.vue'
import ApiSelect from './components/ApiSelect.vue'
import CheckboxGroup from './components/CheckboxGroup.vue'
import IconPicker from './components/IconPicker.vue'
import ImageUpload from '@/components/ms-image-upload/index.vue'
import Tinymce from '@/components/ms-tinymce/index.vue'
import type { Component } from 'vue'
import { ComponentType } from './types'

const componentMap = new Map<ComponentType, Component>()

componentMap.set('Input', ElInput)
componentMap.set('InputPassword', InputPassword)
componentMap.set('InputTextArea', InputTextArea)

componentMap.set('InputNumber', ElInputNumber)

componentMap.set('DatePicker', ElDatePicker)
componentMap.set('TimePicker', ElTimePicker)

componentMap.set('RadioGroup', RadioGroup)

componentMap.set('Select', Select)
componentMap.set('ApiSelect', ApiSelect)
componentMap.set('ApiSelectTree', ApiSelectTree)

componentMap.set('Switch', ElSwitch)

componentMap.set('CheckboxGroup', CheckboxGroup)

componentMap.set('IconPicker', IconPicker)

componentMap.set('ImageUpload', ImageUpload)
componentMap.set('Tinymce', Tinymce)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

export { componentMap }
