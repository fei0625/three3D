import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { UserInfoPasswordType } from '@/apis/imOperation/userManagement/type'
import { getImViolationTypeList } from '@/apis/imOperation/userManagement/index'

export const formColumns: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: 'Icon',
    prop: 'icon',
    component: 'ImageUpload',
    componentProps: {
      disabled: true,
      bucket: 'im'
    }
  },
  {
    label: getI18nValue('userManagement.name'),
    prop: 'name',
    required: true,
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('userManagement.userId'),
    prop: 'userId',
    required: true,
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('userManagement.phone'),
    prop: 'phone',
    required: true,
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('userManagement.email'),
    prop: 'email',
    required: true,
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('userManagement.gender'),
    prop: 'gender',
    component: 'RadioGroup',
    required: true,
    defaultValue: 0,
    componentProps: {
      option: [
        { label: getI18nValue('userManagement.women'), value: 0 },
        { label: getI18nValue('userManagement.male'), value: 1 }
      ]
    }
  },
  {
    label: getI18nValue('userManagement.address'),
    prop: 'address',
    required: true,
    component: 'Input',
    componentProps: {
      disabled: true
    }
  }
]
//重置密码
export const formPasswordColumns: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    prop: 'userId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('userManagement.password'),
    prop: 'password',
    required: true,
    component: 'Input',
    componentProps: {
      showPassword: true,
      maxLength: 32
    }
  },
  {
    label: getI18nValue('userManagement.confirmPassword'),
    prop: 'confirmPassword',
    required: true,
    component: 'Input',
    componentProps: {
      showPassword: true,
      maxLength: 32
    },
    rules: (model: UserInfoPasswordType) => {
      return [
        { required: true, message: getI18nValue('userManagement.confirmCodeCase'), trigger: 'blur' },
        {
          validator: (_, value, callback) => {
            if (value != model.password) callback(new Error(getI18nValue('userManagement.codeCaseMatch')))
            else callback()
          }
        }
      ]
    }
  }
]
//主页查询
export const searchColumns: FormColumn[] = [
  {
    prop: 'name',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('userManagement.name')
    }
  },
  {
    prop: 'userId',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('userManagement.userId')
    }
  },
  {
    prop: 'phone',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('userManagement.phone')
    }
  },
  {
    prop: 'email',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('userManagement.email')
    }
  }
]
//用户列表
export const tableColumns: TableColumn[] = [
  {
    type: 'selection',
    width: 50
  },
  {
    label: getI18nValue('userManagement.userId'),
    prop: 'userId'
  },
  {
    label: getI18nValue('userManagement.name'),
    prop: 'name'
  },
  {
    label: getI18nValue('userManagement.phone'),
    prop: 'phone'
  },
  {
    label: getI18nValue('userManagement.email'),
    prop: 'email'
  },
  {
    label: getI18nValue('userManagement.violationsNumber'),
    prop: 'violationsNumber'
  },
  {
    label: getI18nValue('userManagement.icon'),
    prop: 'icon',
    slot: 'icon',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('userManagement.onlineStatus'),
    prop: 'online',
    slot: 'online',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('userManagement.sensitiveStatus'),
    prop: 'sensitiveStatus',
    slot: 'sensitiveStatus',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  }
]
//违规管理
export const formColumnsViolation: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('userManagement.violationsTypeId'),
    prop: 'violationsTypeId',
    component: 'ApiSelect',
    componentProps: {
      api: getImViolationTypeList,
      labelField: 'name',
      valueField: 'id',
      params: {},
      filterable: true
    },
    required: true
  },
  {
    label: getI18nValue('userManagement.processing'),
    prop: 'processing',
    component: 'Select',
    required: true,
    componentProps: {
      option: [
        { label: getI18nValue('userManagement.packet'), value: 1 },
        { label: getI18nValue('userManagement.ban'), value: 2 },
        { label: getI18nValue('userManagement.warn'), value: 3 }
      ]
    }
  },
  {
    label: getI18nValue('userManagement.postpone'),
    prop: 'postpone',
    component: 'Select',
    required: true,
    componentProps: {
      option: [
        { label: getI18nValue('userManagement.day3'), value: 3 },
        { label: getI18nValue('userManagement.day7'), value: 7 },
        { label: getI18nValue('userManagement.day30'), value: 30 },
        { label: getI18nValue('userManagement.day'), value: -1 }
      ]
    },
    ifShow: ({ model }) => {
      if (model.processing != 3) {
        return true
      }
      return false
    }
  },
  {
    label: getI18nValue('userManagement.violatingContent'),
    prop: 'violatingContent',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxLength: 255
    }
  }
]
//申请授权列表
export const tableApplyColumns: FormColumn[] = [
  {
    label: getI18nValue('userManagement.staffCode'),
    prop: 'staffCode'
  },
  {
    label: getI18nValue('userManagement.viewUser'),
    prop: 'name'
  },
  {
    label: getI18nValue('userManagement.applicationStatus'),
    prop: 'status',
    formatter: (row: any) => {
      const statusMap = {
        0: getI18nValue('userManagement.failure'),
        1: getI18nValue('userManagement.success'),
        2: getI18nValue('userManagement.pendingReview')
      }
      return statusMap[row.status as keyof typeof statusMap] || ''
    }
  },
  {
    label: getI18nValue('userManagement.applyDuration'),
    prop: 'applyDuration'
  },
  {
    label: getI18nValue('userManagement.applyRemark'),
    prop: 'applyRemark'
  },
  {
    label: getI18nValue('userManagement.createTime'),
    prop: 'createTime'
  }
]
//申请授权form表单
export const formApplyColums: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('userManagement.viewUser'),
    prop: 'name',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('userManagement.applyDuration'),
    prop: 'applyDuration',
    component: 'Input',
    required: true,
    componentProps: {
      maxLength: 32
    }
  },
  {
    label: getI18nValue('userManagement.applyProve'),
    prop: 'applyProve',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxLength: 255
    }
  },
  {
    label: getI18nValue('userManagement.applyRemark'),
    prop: 'applyRemark',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxLength: 255
    }
  }
]
