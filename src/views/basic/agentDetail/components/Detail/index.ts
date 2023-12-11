import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'

export const formColumns: FormColumn[] = [
  {
    prop: 'agentId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('agent.agentName'),
    prop: 'agentName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 32
    }
  },

  {
    label: getI18nValue('agent.agentType'),
    prop: 'agentType',
    component: 'Select',
    defaultValue: '1',
    componentProps: {
      option: [
        {
          label: getI18nValue('agent.enterprise'),
          value: '1'
        },
        {
          label: getI18nValue('agent.agent'),
          value: '2'
        },
        {
          label: getI18nValue('agent.personal'),
          value: '3'
        }
      ]
    }
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    component: 'Select',
    defaultValue: '1',
    componentProps: {
      option: [
        {
          label: getI18nValue('common.enable'),
          value: '1'
        },
        {
          label: getI18nValue('common.disable'),
          value: '0'
        }
      ]
    }
  },
  {
    label: getI18nValue('agent.Logo'),
    prop: 'logo',
    component: 'ImageUpload',
    defaultValue: '',
    rules: {
      required: true,
      message: getI18nValue('agent.Logo')
    },
    componentProps: {
      bucket: 'agent',
      accept: 'png,jpg'
    }
  }
]
