import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { getRoleList } from '@/apis/basic/role'
import { getOrgTree } from '@/apis/basic/org'

export const formColumns: FormColumn[] = [
  {
    prop: 'staffId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('staff.image'),
    prop: 'image',
    component: 'ImageUpload',
    required: true,
    defaultValue: '',
    componentProps: {
      bucket: 'staff',
      accept: 'png,jpg'
    },
    rules: {
      required: true,
      message: getI18nValue('staff.image')
    }
  },

  {
    label: getI18nValue('staff.staffCode'),
    prop: 'staffCode',
    component: 'Input',
    componentProps: {
      maxlength: 32
    },
    required: true
  },
  {
    label: getI18nValue('staff.orgId'),
    prop: 'orgId',
    component: 'ApiSelectTree',
    componentProps: {
      api: getOrgTree,
      props: {
        label: 'orgName',
        children: 'children',
        value: 'orgId'
      },
      params: {},
      filterable: true,
      clearable: true
    },
    required: true
  },
  {
    label: getI18nValue('staff.firstName'),
    prop: 'firstName',
    component: 'Input',
    componentProps: {
      maxlength: 32
    },
    required: true
  },
  {
    label: getI18nValue('staff.lastName'),
    prop: 'lastName',
    component: 'Input',
    componentProps: {
      maxlength: 32
    },
    required: true
  },
  {
    label: getI18nValue('staff.secretCode'),
    prop: 'password',
    component: 'InputPassword',
    rules: (model: any) => {
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
    },
    ifShow: ({ model }) => {
      if (model.staffId == null) {
        return true
      }
      return false
    }
  },
  {
    label: getI18nValue('login.confirmCodeCase'),
    prop: 'confirmPassword',
    component: 'InputPassword',
    componentProps: {
      showPassword: true,
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
    },
    ifShow: ({ model }) => {
      if (model.staffId == null) {
        return true
      }
      return false
    }
  },

  {
    label: getI18nValue('common.mobileNum'),
    prop: 'mobileNum',
    component: 'Input',
    rules: [{ required: true, validator: mobileValidate }],
    componentProps: {
      maxlength: 11
    },
    ifShow: ({ model }) => {
      if (model.staffId == null) {
        return true
      }
      return false
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
    },
    ifShow: ({ model }) => {
      if (model.staffId == null) {
        return true
      }
      return false
    }
  },
  {
    label: getI18nValue('staff.role'),
    prop: 'roleIdList',
    component: 'ApiSelect',
    componentProps: {
      clearable: true,
      api: getRoleList,
      collapseTags: true,
      labelField: 'roleName',
      valueField: 'roleId',
      filterable: true,
      multiple: true
    },
    defaultValue: [],
    rules: [
      {
        required: true,
        type: 'array',
        message: getI18nValue('staff.role')
      }
    ]
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'status',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('common.status'),
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
    prop: 'mobileNum',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('common.mobileNum'),
      maxlength: 11
    }
  },
  {
    prop: 'email',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('common.email')
    }
  },
  {
    prop: 'staffCode',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('staff.staffCode')
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('staff.staffCode'),
    prop: 'staffCode'
  },
  {
    label: getI18nValue('staff.firstName'),
    prop: 'firstName'
  },

  {
    label: getI18nValue('staff.lastName'),
    prop: 'lastName'
  },
  {
    label: getI18nValue('common.mobileNum'),
    prop: 'mobileNum',
    slot: 'mobileNum'
  },
  {
    label: getI18nValue('common.email'),
    prop: 'email',
    slot: 'email'
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    slot: 'status',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('staff.orgId'),
    prop: 'orgName'
  },
  {
    label: getI18nValue('staff.role'),
    prop: 'roleList'
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  },
  {
    label: getI18nValue('staff.lastLoginTime'),
    prop: 'lastLoginTime'
  }
]
