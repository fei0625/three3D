import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
export const formColumns: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('imSystemNumber.systemNumberName'),
    prop: 'name',
    component: 'Input',
    required: true
  },
  {
    label: getI18nValue('imSystemNumber.systemNumberAvatar'),
    prop: 'icon',
    component: 'ImageUpload',
    required: true,
    componentProps: {
      bucket: 'system-configuration',
      accept: 'png,jpg'
    },
    rules: {
      required: true,
      message: getI18nValue('imSystemNumber.systemNumberAvatar')
    }
  },
  {
    label: getI18nValue('imSystemNumber.systemNumberDesc'),
    prop: 'desc',
    component: 'InputTextArea'
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'name',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('imSystemNumber.systemNumberName')
    }
  }
]

export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('imSystemNumber.systemNumberId'),
    prop: 'id'
  },
  {
    label: getI18nValue('imSystemNumber.systemNumberName'),
    prop: 'name'
  },
  {
    label: getI18nValue('imSystemNumber.systemNumberAvatar'),
    prop: 'icon',
    slot: 'icon',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('imSystemNumber.systemNumberDesc'),
    prop: 'desc'
  },
  {
    label: getI18nValue('imSystemNumber.createTime'),
    prop: 'createTime'
  }
]
