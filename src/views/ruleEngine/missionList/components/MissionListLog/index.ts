import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'

export const searchColumns: FormColumn[] = [
  {
    prop: 'status',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('common.status'),
      option: [
        {
          label: getI18nValue('missionList.status1'),
          value: '1'
        },
        {
          label: getI18nValue('missionList.status0'),
          value: '0'
        }
      ]
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('missionList.jobName'),
    prop: 'jobName'
  },
  {
    label: getI18nValue('missionList.jobId'),
    prop: 'jobId'
  },
  {
    label: getI18nValue('missionList.jobGroup'),
    prop: 'jobGroup'
  },
  {
    label: getI18nValue('missionList.invokeTarget'),
    prop: 'invokeTarget'
  },
  {
    label: getI18nValue('missionList.jobLogInfo'),
    prop: 'jobMessage'
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    formatter(row: any) {
      let text = ''
      switch (row.status) {
        case '1':
          text = getI18nValue('missionList.status1')
          break
        case '0':
          text = getI18nValue('missionList.status0')
          break
        default:
          break
      }
      return text
    }
  },
  {
    label: getI18nValue('missionList.jobException'),
    prop: 'exceptionInfo'
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  }
]
