import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
export const formColumns: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('imVocabulary.type'),
    prop: 'name',
    component: 'Input',
    required: true
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'likeName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('imVocabulary.type')
    }
  },
  {
    prop: 'status',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('common.status'),
      option: [
        {
          label: getI18nValue('common.disable'),
          value: 0
        },
        {
          label: getI18nValue('common.enable'),
          value: 1
        }
      ]
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('imVocabulary.type'),
    prop: 'name'
  },
  {
    label: getI18nValue('imVocabulary.count'),
    prop: 'count'
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    slot: 'status',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('imVocabulary.updateTime'),
    prop: 'updateTime'
  },
  {
    label: getI18nValue('imVocabulary.triggerCount'),
    prop: 'triggerCount'
  },
  {
    label: getI18nValue('imVocabulary.violatingUserCount'),
    prop: 'violatingUserCount'
  }
]
