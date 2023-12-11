import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { AgentType } from '@/apis/basic/agent/type'
import { getRoleList } from '@/apis/basic/role'
export const formColumns: FormColumn[] = [
  {
    prop: 'agentId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: 'Icon',
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
  },
  {
    label: getI18nValue('agent.agentName'),
    prop: 'agentName',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 32
    }
  },
  {
    label: getI18nValue('agent.firstName'),
    prop: 'firstName',
    component: 'Input',
    componentProps: {
      maxlength: 32
    },
    required: true
  },
  {
    label: getI18nValue('agent.lastName'),
    prop: 'lastName',
    component: 'Input',
    componentProps: {
      maxlength: 32
    },
    required: true
  },
  {
    label: getI18nValue('agent.staffCode'),
    prop: 'staffCode',
    component: 'Input',
    componentProps: {
      maxlength: 32
    },
    required: true
  },
  {
    label: getI18nValue('agent.secretCode'),
    prop: 'password',
    component: 'InputPassword',
    rules: model => {
      return [
        {
          required: true,
          validator: passwordValidity(model)
        }
      ]
    },
    componentProps: {
      showPassword: true,
      maxlength: 32
    }
  },
  {
    label: getI18nValue('agent.mobileNum'),
    prop: 'phone',
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
      { required: true, message: getI18nValue('common.email1'), trigger: 'blur' },
      { type: 'email', message: getI18nValue('common.email2'), trigger: 'blur' }
    ],
    componentProps: {
      maxlength: 32
    }
  },
  {
    label: getI18nValue('agent.role'),
    prop: 'roleId',
    component: 'ApiSelect',
    componentProps: {
      clearable: true,
      api: getRoleList,
      labelField: 'roleName',
      valueField: 'roleId',
      filterable: true
    },
    defaultValue: [],
    required: true
  },
  {
    label: getI18nValue('agent.agentType'),
    prop: 'agentType',
    component: 'Select',
    defaultValue: '2',
    required: true,
    componentProps: {
      option: [
        // {
        //   label: getI18nValue('agent.enterprise'),
        //   value: '1'
        // },
        {
          label: getI18nValue('agent.agent'),
          value: '2'
        }
        // {
        //   label: getI18nValue('agent.personal'),
        //   value: '3'
        // }
      ]
    },
    tooltip: getI18nValue('agent.distinguishBetween')
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    component: 'Select',
    required: true,
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
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'agentName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('agent.agentName')
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('agent.Logo'),
    prop: 'logo',
    slot: 'logo',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('agent.agentCode'),
    prop: 'agentCode'
  },
  {
    label: getI18nValue('agent.agentName'),
    prop: 'agentName'
  },
  {
    label: getI18nValue('agent.agentType'),
    prop: 'agentType',
    formatter(row: AgentType) {
      let agentTypeMap = {
        '1': getI18nValue('agent.enterprise'),
        '2': getI18nValue('agent.agent'),
        '3': getI18nValue('agent.personal')
      }

      return agentTypeMap[row.agentType as keyof typeof agentTypeMap] ?? ''
    }
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    slot: 'status',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  }
]
