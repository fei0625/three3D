import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { QuartzJobType } from '@/apis/ruleEngine/missionList/type'

export const formColumns: FormColumn[] = [
  {
    prop: 'jobId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('missionList.jobName'),
    prop: 'jobName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 32
    }
  },
  {
    label: getI18nValue('missionList.jobGroup'),
    prop: 'jobGroup',
    component: 'Select',
    required: true,
    defaultValue: 'DEFAULT',
    componentProps: {
      option: [
        {
          label: getI18nValue('missionList.default'),
          value: 'DEFAULT'
        }
      ]
    }
  },
  {
    label: getI18nValue('missionList.invokeTarget'),
    prop: 'invokeTarget',
    component: 'Input',
    slot: 'invokeTarget'
  },
  {
    label: getI18nValue('missionList.cronExpression'),
    prop: 'cronExpression',
    required: true,
    component: 'Input',
    slot: 'cronExpression'
  },
  {
    label: getI18nValue('missionList.misfirePolicy'),
    prop: 'misfirePolicy',
    component: 'RadioGroup',
    required: true,
    defaultValue: '1',
    componentProps: {
      option: [
        {
          label: getI18nValue('missionList.immediateExecution'),
          value: '1'
        },
        { label: getI18nValue('missionList.PerformA'), value: '2' },
        { label: getI18nValue('missionList.GiveUpToPerform'), value: '3' }
      ]
    }
  },
  {
    label: getI18nValue('missionList.concurrent'),
    prop: 'concurrent',
    component: 'RadioGroup',
    required: true,
    defaultValue: '0',
    componentProps: {
      option: [
        { label: getI18nValue('missionList.ban'), value: '0' },
        { label: getI18nValue('missionList.allow'), value: '1' }
      ]
    }
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      type: 'hidden',
      option: [
        { label: getI18nValue('common.enable'), value: '1' },
        { label: getI18nValue('common.disable'), value: '0' }
      ]
    }
  },
  {
    label: getI18nValue('common.description'),
    prop: 'remark',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 255
    }
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'jobName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('missionList.jobName')
    }
  },
  {
    prop: 'createModel',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('missionList.createModel'),
      option: [
        {
          label: getI18nValue('missionList.createModel1'),
          value: '1'
        },
        {
          label: getI18nValue('missionList.createModel2'),
          value: '2'
        }
      ]
    }
  },
  {
    prop: 'status',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('common.status'),
      option: [
        { label: getI18nValue('common.enable'), value: '1' },
        { label: getI18nValue('common.disable'), value: '0' }
      ]
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('missionList.jobId'),
    prop: 'jobId'
  },
  {
    label: getI18nValue('missionList.jobName'),
    prop: 'jobName'
  },
  {
    label: getI18nValue('missionList.invokeTarget'),
    prop: 'invokeTarget'
  },
  {
    label: getI18nValue('missionList.cronExpression'),
    prop: 'cronExpression'
  },
  {
    label: getI18nValue('missionList.createModel'),
    prop: 'createModel',
    formatter(row: QuartzJobType) {
      const createModelMap = {
        '1': getI18nValue('missionList.createModel1'),
        '2': getI18nValue('missionList.createModel2')
      }
      return createModelMap[row.createModel as keyof typeof createModelMap] ?? ''
    }
  },
  {
    label: getI18nValue('missionList.concurrent'),
    prop: 'concurrent',
    formatter(row: QuartzJobType) {
      const concurrentMap = {
        '0': getI18nValue('missionList.ban'),
        '1': getI18nValue('missionList.allow')
      }
      return concurrentMap[row.concurrent as keyof typeof concurrentMap] ?? ''
    }
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    slot: 'status'
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  }
]
