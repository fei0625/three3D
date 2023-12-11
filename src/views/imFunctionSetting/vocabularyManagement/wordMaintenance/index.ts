import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { ImVocabularyType } from '@/apis/imFunctionSetting/vocabularyManagement/type'
import { getImViolationTypeList } from '@/apis/imFunctionSetting/vocabularyManagement'
export const formColumns: FormColumn[] = [
  {
    prop: 'id',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    prop: 'sensitive',
    label: getI18nValue('imVocabulary.sensitive'),
    component: 'InputTextArea',
    required: true,
    componentProps: {
      rows: 3
    }
  },
  {
    label: getI18nValue('imVocabulary.type'),
    prop: 'violationTypeId',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: getImViolationTypeList,
      labelField: 'name',
      valueField: 'id',
      filterable: true
    }
  },
  {
    label: getI18nValue('imVocabulary.risk'),
    prop: 'risk',
    component: 'Select',
    defaultValue: 3,
    componentProps: {
      option: [
        {
          label: getI18nValue('imVocabulary.risk3'),
          value: 3
        },
        {
          label: getI18nValue('imVocabulary.risk2'),
          value: 2
        },
        {
          label: getI18nValue('imVocabulary.risk1'),
          value: 1
        }
      ]
    }
  },
  {
    label: getI18nValue('imVocabulary.sensitiveUser'),
    prop: 'sensitiveUser',
    slot: 'sensitiveUser',
    component: 'Input'
  },
  {
    label: getI18nValue('imVocabulary.messageImpact'),
    prop: 'messageEffect',
    component: 'Select',
    defaultValue: 0,
    componentProps: {
      option: [
        {
          label: getI18nValue('imVocabulary.impact0'),
          value: 0
        },
        {
          label: getI18nValue('imVocabulary.impact1'),
          value: 1
        },
        {
          label: getI18nValue('imVocabulary.impact2'),
          value: 2
        }
      ]
    }
  },
  {
    label: getI18nValue('imVocabulary.accountImpact'),
    prop: 'accountEffect',
    slot: 'accountEffect',
    component: 'Input'
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'sensitive',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('imVocabulary.sensitive')
    }
  },
  {
    prop: 'violationTypeId',
    component: 'ApiSelect',
    componentProps: {
      placeholder: getI18nValue('imVocabulary.type'),
      api: getImViolationTypeList,
      labelField: 'name',
      valueField: 'id',
      filterable: true
    }
  },
  {
    prop: 'risk',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('imVocabulary.risk'),
      option: [
        {
          label: getI18nValue('imVocabulary.risk3'),
          value: 3
        },
        {
          label: getI18nValue('imVocabulary.risk2'),
          value: 2
        },
        {
          label: getI18nValue('imVocabulary.risk1'),
          value: 1
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
    type: 'selection'
  },
  {
    label: getI18nValue('imVocabulary.sensitive'),
    prop: 'sensitive'
  },
  {
    label: getI18nValue('imVocabulary.type'),
    prop: 'violationType'
  },
  {
    label: getI18nValue('imVocabulary.risk'),
    prop: 'risk',
    formatter(row: ImVocabularyType) {
      return getI18nValue('imVocabulary.risk' + row.risk)
    }
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
  }
]
