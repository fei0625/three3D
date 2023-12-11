import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { ImApplyPageListType } from '@/apis/imOperation/authorizationManagement/type'

export const formColumns: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('authorizationManagement.applicationList'),
    prop: 'name',
    component: 'Input',
    required: true,
    componentProps: {
      disabled: true
    }
  },
  {
    label: getI18nValue('authorizationManagement.applyDuration'),
    prop: 'applyDuration',
    component: 'Input',
    componentProps: {
      disabled: true
    },
    required: true
  },
  {
    label: getI18nValue('authorizationManagement.applyProve'),
    prop: 'applyProve',
    component: 'InputTextArea',
    componentProps: {
      disabled: true
    },
    required: true
  },
  {
    label: getI18nValue('authorizationManagement.applyRemark'),
    prop: 'applyRemark',
    component: 'InputTextArea',
    componentProps: {
      disabled: true
    },
    required: true
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'staffCode',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('authorizationManagement.staffCode')
    }
  },
  {
    prop: 'status',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('authorizationManagement.status'),
      option: [
        {
          label: getI18nValue('authorizationManagement.pendingReview'),
          value: 2
        },
        {
          label: getI18nValue('authorizationManagement.success'),
          value: 1
        },
        {
          label: getI18nValue('authorizationManagement.failed'),
          value: 0
        }
      ]
    }
  },
  {
    prop: 'groupId',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('authorizationManagement.groupId')
    }
  },
  {
    prop: 'applyDuration',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('authorizationManagement.applyDuration')
    }
  }
]

export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('authorizationManagement.staffName'),
    prop: 'staffName'
  },
  {
    label: getI18nValue('authorizationManagement.staffCode'),
    prop: 'staffCode'
  },
  {
    label: getI18nValue('authorizationManagement.status'),
    prop: 'status',
    formatter: (row: ImApplyPageListType) => {
      const statusMap = {
        0: getI18nValue('authorizationManagement.failed'),
        1: getI18nValue('authorizationManagement.success'),
        2: getI18nValue('authorizationManagement.pendingReview')
      }
      return statusMap[row.status as keyof typeof statusMap] || ''
    }
  },
  {
    label: getI18nValue('authorizationManagement.groupId'),
    prop: 'name'
  },
  {
    label: getI18nValue('authorizationManagement.applyDuration'),
    prop: 'applyDuration'
  },
  {
    label: getI18nValue('authorizationManagement.applyRemark'),
    prop: 'applyRemark'
  },
  {
    label: getI18nValue('authorizationManagement.applicationTime'),
    prop: 'createTime'
  },
  {
    label: getI18nValue('authorizationManagement.authorizationStartTime'),
    prop: 'authorizationStartTime',
    formatter(row: ImApplyPageListType) {
      return row.authorizationStartTime ?? '--'
    }
  },
  {
    label: getI18nValue('authorizationManagement.authorizationEndTime'),
    prop: 'authorizationEndTime',
    formatter(row: ImApplyPageListType) {
      return row.authorizationEndTime ?? '--'
    }
  }
]
