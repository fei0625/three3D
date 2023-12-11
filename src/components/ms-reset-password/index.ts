import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'

export const formColumns: FormColumn[] = [
  {
    label: getI18nValue('login.staffAccount'),
    prop: 'staffCode',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('login.originalCodeCase'),
    prop: 'originalPassword',
    component: 'InputPassword',
    required: true,
    componentProps: {
      showPassword: true,
      clearable: true,
      maxlength: 32
    }
  },
  {
    label: getI18nValue('login.newCodeCase'),
    prop: 'password',
    component: 'InputPassword',
    componentProps: {
      showPassword: true,
      clearable: true,
      maxlength: 32
    },
    tooltip: {
      content: passwordRules(),
      rawContent: true
    },
    rules: (model: any) => {
      return [
        {
          required: true,
          validator: passwordValidity(model)
        }
      ]
    }
  },
  {
    label: getI18nValue('login.confirmCodeCase'),
    prop: 'confirmPassword',
    component: 'InputPassword',
    componentProps: {
      showPassword: true,
      clearable: true,
      maxlength: 32
    },
    rules: (model: any) => {
      return [
        {
          required: true,
          message: getI18nValue('form.codeCaseBlank')
        },
        {
          validator: (_, value, callback) => {
            if (value != model.password) callback(new Error(getI18nValue('form.codeCaseMatch')))
            else callback()
          }
        }
      ]
    }
  }
]
