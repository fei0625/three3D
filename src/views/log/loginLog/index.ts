import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { getStaffList } from '@/apis/log/loginLog'
import { useUserStore } from '@/stores/modules/user'

const userStore = useUserStore()

export const searchColumns: FormColumn[] = [
  {
    prop: 'staffId',
    component: 'ApiSelect',
    componentProps: {
      placeholder: getI18nValue('loginLog.staffName'),
      api: getStaffList,
      labelField: 'staffCode',
      valueField: 'staffId'
    },
    ifShow: () => {
      const { agentId } = userStore.userInfo
      return agentId == -1
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
    label: getI18nValue('loginLog.staffName'),
    prop: 'staffName'
  },
  {
    label: getI18nValue('loginLog.browser'),
    prop: 'browser'
  },
  {
    label: getI18nValue('loginLog.os'),
    prop: 'os'
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    formatter(row: any) {
      // 0: 启用，1: 禁用
      const statusMap = {
        1: getI18nValue('loginLog.enable'),
        0: getI18nValue('loginLog.disable')
      }
      return statusMap[row.status as keyof typeof statusMap] ?? ''
    }
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  },
  {
    label: getI18nValue('loginLog.ip'),
    prop: 'ip'
  }
]
