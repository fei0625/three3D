import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { getOperatLogStaffList } from '@/apis/log/operateLog'

export const searchColumns: FormColumn[] = [
  {
    prop: 'staffId',
    component: 'ApiSelect',
    componentProps: {
      placeholder: getI18nValue('operateLog.staffName'),
      api: getOperatLogStaffList,
      labelField: 'staffCode',
      valueField: 'staffId'
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
    label: getI18nValue('operateLog.actionType'),
    prop: 'actionType',
    formatter(row: any) {
      let text = ''
      switch (row.actionType) {
        case 1:
          text = 'POST'
          break
        case 2:
          text = 'DELETE'
          break
        case 3:
          text = 'PUT'
          break
        default:
          break
      }
      return text
    }
  },
  {
    label: getI18nValue('operateLog.sysMenuName'),
    prop: 'sysMenuName'
  },
  {
    label: getI18nValue('operateLog.menuUrl'),
    prop: 'menuUrl'
  },
  {
    label: getI18nValue('operateLog.requestParam'),
    prop: 'requestParam'
  },
  {
    label: getI18nValue('operateLog.ip'),
    prop: 'ip'
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  },
  {
    label: getI18nValue('operateLog.staffName'),
    prop: 'staffName'
  }
]
