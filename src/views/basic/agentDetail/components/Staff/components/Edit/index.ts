import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'

export const formColumns: FormColumn[] = [
  {
    prop: 'staffCode',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    prop: 'staffId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('common.mobileNum'),
    prop: 'mobileNum',
    component: 'Input',
    rules: [{ required: true, validator: mobileValidate }],
    componentProps: {
      maxlength: 11
    }
  },
  {
    label: getI18nValue('common.email'),
    prop: 'email',
    component: 'Input',
    rules: [
      { required: true, message: getI18nValue('common.email1') },
      { type: 'email', message: getI18nValue('common.email2') }
    ]
  }
]
