import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'

export const searchColumns: FormColumn[] = [
  {
    prop: 'staffName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('operationHistory.staffName')
    }
  },
  {
    prop: 'operationTerm',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('operationHistory.operationTerm')
    }
  },
  {
    prop: 'DatePicker',
    component: 'DatePicker',
    componentProps: {
      type: 'datetimerange',
      unlinkPanels: true,
      teleported: false,
      valueFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('operationHistory.staffName'),
    prop: 'staffName'
  },
  {
    label: getI18nValue('operationHistory.ip'),
    prop: 'ip'
  },
  {
    label: getI18nValue('operationHistory.operationTerm'),
    prop: 'operationTerm'
  },
  {
    label: getI18nValue('operationHistory.createTime'),
    prop: 'createTime'
  },
  {
    label: getI18nValue('operationHistory.funRemark'),
    prop: 'funRemark'
  }
]
