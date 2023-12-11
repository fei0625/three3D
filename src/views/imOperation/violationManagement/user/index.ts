import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'

export const searchColumns: FormColumn[] = [
  {
    prop: 'userName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('violationManagement.userName')
    }
  },
  {
    prop: 'phone',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('violationManagement.phone')
    }
  },
  {
    prop: 'email',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('violationManagement.email')
    }
  },
  {
    prop: 'online',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('violationManagement.onlineStatus'),
      option: [
        {
          label: getI18nValue('violationManagement.online'),
          value: 1
        },
        {
          label: getI18nValue('violationManagement.failure'),
          value: 0
        }
      ]
    }
  },
  {
    prop: 'sensitiveStatus',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('violationManagement.sensitiveStatus'),
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
    label: getI18nValue('violationManagement.userName'),
    prop: 'name'
  },
  {
    label: getI18nValue('violationManagement.userId'),
    prop: 'userId'
  },
  {
    label: getI18nValue('violationManagement.phone'),
    prop: 'phone'
  },
  {
    label: getI18nValue('violationManagement.email'),
    prop: 'email'
  },
  {
    label: getI18nValue('violationManagement.violationsTypeId'),
    prop: 'violationsTypeId',
    formatter: (row: any) => {
      if (row.imUserViolationsLog) {
        return row.imUserViolationsLog.violationsTypeName
      }
      return ''
    }
  },
  {
    label: getI18nValue('violationManagement.violatingContent'),
    prop: 'violatingContent',
    slot: 'violatingContent',
    formatter: (row: any) => {
      if (row.imUserViolationsLog) {
        return row.imUserViolationsLog.violatingContent
      }
      return ''
    }
  },
  {
    label: getI18nValue('violationManagement.processing'),
    prop: 'processing',
    formatter: (row: any) => {
      if (row.imUserViolationsLog) {
        if (row.imUserViolationsLog.processing == 1) {
          return getI18nValue('violationManagement.packet')
        } else if (row.imUserViolationsLog.processing == 2) {
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
      if (row.imUserViolationsLog) {
        if (row.imUserViolationsLog.postpone == -1) {
          return getI18nValue('violationManagement.durable')
        } else if (row.imUserViolationsLog.postpone == 0) {
          return '--'
        } else {
          return row.imUserViolationsLog.postpone + getI18nValue('violationManagement.days')
        }
      }
      return ''
    }
  },
  {
    label: getI18nValue('violationManagement.startTime'),
    prop: 'startTime',
    formatter: (row: any) => {
      if (row.imUserViolationsLog) {
        if (row.imUserViolationsLog.startTime) {
          return row.imUserViolationsLog.startTime
        }
      }
      return '--'
    }
  },
  {
    label: getI18nValue('violationManagement.endTime'),
    prop: 'endTime',
    formatter: (row: any) => {
      if (row.imUserViolationsLog) {
        if (row.imUserViolationsLog.endTime) {
          if (row.imUserViolationsLog.postpone != -1) {
            return row.imUserViolationsLog.endTime
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
