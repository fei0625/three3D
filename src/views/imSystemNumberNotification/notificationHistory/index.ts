import { TableColumn, FormColumn } from '@/components/ms-table'
import { getI18nValue } from '@/utils/i18n/index'

export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('notificationHistory.pushTime'),
    prop: 'pushTime'
  },
  {
    label: getI18nValue('notificationHistory.pushType'),
    prop: 'pushType',
    formatter(row: any) {
      if (row.pushType == 1) {
        return getI18nValue('fullUserNotification.systemNotification')
      } else {
        return getI18nValue('fullUserNotification.systemNumberNotification')
      }
    }
  },
  {
    label: getI18nValue('notificationHistory.pushModel'),
    prop: 'pushModel',
    formatter(row: any) {
      if (row.pushModel == 3) {
        return getI18nValue('fullUserNotification.all')
      } else if (row.pushModel == 2) {
        return 'Android'
      } else {
        return 'IOS'
      }
    }
  },
  {
    label: getI18nValue('notificationHistory.userRange'),
    prop: 'userRange',
    formatter(row: any) {
      if (row.userRange == 1) {
        return getI18nValue('fullUserNotification.allUsers')
      } else {
        return row.groupName
      }
    }
  },
  {
    label: getI18nValue('notificationHistory.pushContent'),
    prop: 'pushContent'
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'pushType',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('notificationHistory.pushType'),
      option: [
        {
          label: getI18nValue('notificationHistory.pushType1'),
          value: 1
        },
        {
          label: getI18nValue('notificationHistory.pushType2'),
          value: 2
        }
      ]
    }
  }
]
