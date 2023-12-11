import { TableColumn } from '@/components/ms-table'
import { getI18nValue } from '@/utils/i18n/index'
import { FormColumn } from '@/components/ms-form'
import { getImViolationTypeList } from '@/apis/imOperation/groupManagement/index'

//群组详情表单
export const formColumns: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('groupManagement.icon'),
    prop: 'icon',
    component: 'ImageUpload',
    componentProps: {
      disabled: true,
      bucket: 'im'
    }
  },
  {
    label: getI18nValue('groupManagement.name'),
    prop: 'name',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('groupManagement.notice'),
    prop: 'notice',
    component: 'InputTextArea',
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('groupManagement.userTable'),
    prop: 'userTable',
    slot: 'userTable',
    component: 'Input',
    componentProps: {
      maxlength: 32
    }
  }
]

//群组列表查询
export const searchColumns: FormColumn[] = [
  {
    prop: 'name',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('groupManagement.name')
    }
  },
  {
    prop: 'groupId',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('groupManagement.groupId')
    }
  },
  {
    prop: 'userName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('groupManagement.userName')
    }
  }
]

//群组列表
export const tableColumns: TableColumn[] = [
  {
    type: 'selection',
    width: 50
  },
  {
    label: getI18nValue('groupManagement.groupId'),
    prop: 'groupId'
  },
  {
    label: getI18nValue('groupManagement.name'),
    prop: 'name'
  },
  {
    label: getI18nValue('groupManagement.userName'),
    prop: 'userName'
  },
  {
    label: getI18nValue('groupManagement.address'),
    prop: 'address'
  },
  {
    label: getI18nValue('groupManagement.violationsNumber'),
    prop: 'violationsNumber'
  },
  {
    label: getI18nValue('groupManagement.number'),
    prop: 'number'
  },
  {
    label: getI18nValue('groupManagement.sensitiveStatus'),
    prop: 'sensitiveStatus',
    slot: 'sensitiveStatus',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  }
]

//用户列表
export const tableUserColumns: TableColumn[] = [
  {
    label: getI18nValue('groupManagement.diminutive'),
    prop: 'userName'
  },
  {
    label: getI18nValue('groupManagement.userId'),
    prop: 'userId'
  },
  {
    label: getI18nValue('groupManagement.phone'),
    prop: 'phone'
  },
  {
    label: getI18nValue('groupManagement.email'),
    prop: 'email'
  }
]

//用户列表查询条件
export const searchUserColumns: FormColumn[] = [
  {
    prop: 'userName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('groupManagement.diminutive')
    }
  },
  {
    prop: 'userId',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('groupManagement.userId')
    }
  }
  // {
  //   prop: 'phoneName',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: getI18nValue('groupManagement.phone')
  //   }
  // },
  // {
  //   prop: 'email',
  //   component: 'Input',
  //   componentProps: {
  //     placeholder: getI18nValue('groupManagement.email')
  //   }
  // }
]

//申请授权列表
export const tableApplyColumns: FormColumn[] = [
  {
    label: getI18nValue('groupManagement.staffCode'),
    prop: 'staffCode'
  },
  {
    label: getI18nValue('groupManagement.viewGroup'),
    prop: 'name'
  },
  {
    label: getI18nValue('groupManagement.status'),
    prop: 'status',
    formatter: (row: any) => {
      const statusMap = {
        0: getI18nValue('groupManagement.abortive'),
        1: getI18nValue('groupManagement.success'),
        2: getI18nValue('groupManagement.pendingReview')
      }
      return statusMap[row.status as keyof typeof statusMap] || ''
    }
  },
  {
    label: getI18nValue('groupManagement.applyDuration'),
    prop: 'applyDuration'
  },
  {
    label: getI18nValue('groupManagement.applyRemark'),
    prop: 'applyRemark'
  },
  {
    label: getI18nValue('groupManagement.applicationTime'),
    prop: 'createTime'
  }
]

//创建申请授权
export const formApplyColums: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('groupManagement.viewGroup'),
    prop: 'name',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('groupManagement.applyDuration'),
    prop: 'applyDuration',
    component: 'Input',
    required: true,
    componentProps: {
      maxLength: 32
    }
  },
  {
    label: getI18nValue('groupManagement.applyProve'),
    prop: 'applyProve',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxLength: 255
    }
  },
  {
    label: getI18nValue('groupManagement.applyRemark'),
    prop: 'applyRemark',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxLength: 255
    }
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
    label: getI18nValue('groupManagement.violationsTypeId'),
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
    label: getI18nValue('groupManagement.processing'),
    prop: 'processing',
    component: 'Select',
    required: true,
    componentProps: {
      option: [
        { label: getI18nValue('groupManagement.packet'), value: 1 },
        { label: getI18nValue('groupManagement.ban'), value: 2 },
        { label: getI18nValue('groupManagement.warn'), value: 3 }
      ]
    }
  },
  {
    label: getI18nValue('groupManagement.postpone'),
    prop: 'postpone',
    component: 'Select',
    required: true,
    componentProps: {
      option: [
        { label: getI18nValue('groupManagement.day3'), value: 3 },
        { label: getI18nValue('groupManagement.day7'), value: 7 },
        { label: getI18nValue('groupManagement.day30'), value: 30 },
        { label: getI18nValue('groupManagement.day'), value: -1 }
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
    label: getI18nValue('groupManagement.violatingContent'),
    prop: 'violatingContent',
    component: 'InputTextArea',
    required: true,
    componentProps: {
      maxLength: 255
    }
  }
]
