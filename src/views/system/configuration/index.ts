import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'

export const formColumns: FormColumn[] = [
  {
    prop: 'systemId',
    component: 'Input',
    defaultValue: 1,
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('configuration.photoUrl'),
    prop: 'photoUrl',
    defaultValue: '',
    component: 'ImageUpload',
    componentProps: {
      bucket: 'system-configuration'
    }
  },
  {
    label: getI18nValue('configuration.passwordInterval'),
    prop: 'passwordInterval',
    component: 'InputNumber',
    suffix: getI18nValue('configuration.days'),
    componentProps: {
      min: 1
    },

    rules: {
      required: true,
      validator: sizeValidate(30, 9999)
    }
  },
  {
    label: getI18nValue('configuration.notificationDuration'),
    suffix: getI18nValue('configuration.seconds'),
    prop: 'notificationDuration',
    component: 'InputNumber',
    componentProps: {
      min: 1
    },
    rules: {
      required: true,
      validator: sizeValidate(1, 30)
    }
  },
  {
    label: getI18nValue('configuration.passwordExpiration'),
    suffix: getI18nValue('configuration.days'),
    divider: true,
    prop: 'passwordExpiration',
    component: 'InputNumber',
    componentProps: {
      min: 1
    },
    rules: {
      required: true,
      validator: sizeValidate(1, 30)
    }
  },
  {
    label: getI18nValue('configuration.strategies'),
    prop: 'strategies',
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      option: [
        {
          label: getI18nValue('configuration.lockUser'),
          value: 0
        },
        {
          label: getI18nValue('configuration.lockDevice'),
          value: 1
        }
      ]
    }
  },
  {
    label: getI18nValue('configuration.attempts'),
    prop: 'attempts',
    component: 'InputNumber',
    suffix: getI18nValue('configuration.times'),
    componentProps: {
      min: 1
    },
    rules: {
      required: true,
      validator: sizeValidate(1, 99)
    }
  },
  {
    label: getI18nValue('configuration.lock'),
    prop: 'lock',
    component: 'InputNumber',
    suffix: getI18nValue('configuration.minutes'),
    divider: true,
    componentProps: {
      min: 1
    },
    rules: {
      required: true,
      validator: sizeValidate(1, 999)
    }
  },
  {
    label: getI18nValue('configuration.lockScreenFlag'),
    prop: 'lockScreenFlag',
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      option: [
        {
          label: getI18nValue('common.enable'),
          value: 1
        },
        {
          label: getI18nValue('common.disable'),
          value: 0
        }
      ]
    }
  },
  {
    label: getI18nValue('configuration.lockScreenTime'),
    prop: 'lockScreenTime',
    suffix: getI18nValue('configuration.minutes'),
    divider: true,
    component: 'InputNumber',
    componentProps: {
      min: 1
    },
    rules: {
      required: true,
      validator: sizeValidate(1, 99)
    }
  },
  {
    label: getI18nValue('configuration.validityDuration'),
    prop: 'validityDuration',
    suffix: getI18nValue('configuration.minutes'),
    divider: true,
    component: 'InputNumber',
    componentProps: {
      min: 1
    },
    rules: {
      required: true,
      validator: sizeValidate(1, 10080)
    }
  },
  {
    label: getI18nValue('configuration.loginMode'),
    prop: 'loginMode',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      option: [
        {
          label: getI18nValue('configuration.loginMode1'),
          value: 1
        },
        {
          label: getI18nValue('configuration.loginMode2'),
          value: 2
        },
        {
          label: getI18nValue('configuration.loginMode3'),
          value: 3
        }
      ]
    }
  },
  {
    label: getI18nValue('configuration.logDay'),
    prop: 'logDay',
    component: 'InputNumber',
    suffix: getI18nValue('configuration.days'),

    componentProps: {
      min: 1
    },
    rules: {
      required: true,
      validator: sizeValidate(1, 30)
    }
  }
]
