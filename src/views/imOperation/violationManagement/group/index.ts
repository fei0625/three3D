import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'

export const searchColumns: FormColumn[] = [
  {
    prop: 'name',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('violationManagement.groupName')
    }
  },
  {
    prop: 'groupId',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('violationManagement.groupId')
    }
  },
  {
    prop: 'sensitiveStatus',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('violationManagement.sensitiveUsers'),
      option: [
        {
          label: getI18nValue('violationManagement.yes'),
          value: 1
        },
        {
          label: getI18nValue('violationManagement.no'),
          value: 0
        }
      ]
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('violationManagement.groupName'),
    prop: 'name'
  },
  {
    label: getI18nValue('violationManagement.groupId'),
    prop: 'groupId'
  },
  {
    label: getI18nValue('violationManagement.violationsTypeId'),
    prop: 'violationsTypeName',
    formatter: (row: any) => {
      if (row.imGroupViolationsLog) {
        return row.imGroupViolationsLog.violationsTypeName
      }
      return ''
    }
  },
  {
    label: getI18nValue('violationManagement.violatingContent'),
    prop: 'violatingContent',
    slot: 'violatingContent',
    formatter: (row: any) => {
      if (row.imGroupViolationsLog) {
        return row.imGroupViolationsLog.violatingContent
      }
      return ''
    }
  },
  {
    label: getI18nValue('violationManagement.processing'),
    prop: 'processing',
    formatter: (row: any) => {
      if (row.imGroupViolationsLog) {
        if (row.imGroupViolationsLog.processing == 1) {
          return getI18nValue('violationManagement.packet')
        } else if (row.imGroupViolationsLog.processing == 2) {
          return getI18nValue('violationManagement.ban')
        } else {
          return getI18nValue('violationManagement.warn')
        }
      }
      return ''
    }
  },
  {
    label: getI18nValue('violationManagement.postpone'),
    prop: 'postpone',
    formatter: (row: any) => {
      if (row.imGroupViolationsLog) {
        if (row.imGroupViolationsLog.postpone) {
          if (row.imGroupViolationsLog.postpone == -1) {
            return getI18nValue('violationManagement.durable')
          } else if (row.imGroupViolationsLog.postpone == 0) {
            return '--'
          } else {
            return row.imGroupViolationsLog.postpone + getI18nValue('violationManagement.days')
          }
        }
      }
      return '--'
    }
  },
  {
    label: getI18nValue('violationManagement.startTime'),
    prop: 'startTime',
    formatter: (row: any) => {
      if (row.imGroupViolationsLog) {
        if (row.imGroupViolationsLog.startTime) {
          return row.imGroupViolationsLog.startTime
        }
      }
      return '--'
    }
  },
  {
    label: getI18nValue('violationManagement.endTime'),
    prop: 'endTime',
    formatter: (row: any) => {
      if (row.imGroupViolationsLog) {
        if (row.imGroupViolationsLog.endTime) {
          if (row.imGroupViolationsLog.postpone != -1) {
            return row.imGroupViolationsLog.endTime
          }
        }
      }
      return '--'
    }
  },
  {
    label: getI18nValue('violationManagement.sensitiveStatus'),
    prop: 'sensitiveStatus',
    slot: 'sensitiveStatus'
  }
]
