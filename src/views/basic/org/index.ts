import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n/index'
import { getOrgTree } from '@/apis/basic/org'

export const formColumns: FormColumn[] = [
  {
    prop: 'orgId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('org.parentOrgId'),
    prop: 'parentOrgId',
    component: 'ApiSelectTree',
    componentProps: {
      api: getOrgTree,
      clearable: true,
      filterable: true,
      params: {},
      props: {
        label: 'orgName',
        children: 'children',
        value: 'orgId'
      }
    }
  },
  {
    label: getI18nValue('org.orgCode'),
    prop: 'orgCode',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 32
    }
  },
  {
    label: getI18nValue('org.orgName'),
    prop: 'orgName',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 32
    }
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'orgName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('org.orgName')
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('org.orgName'),
    prop: 'orgName'
  },
  {
    label: getI18nValue('org.orgCode'),
    prop: 'orgCode'
  },
  {
    label: getI18nValue('common.status'),
    prop: 'status',
    slot: 'status',
    showOverflowTooltip: false
  },
  {
    label: getI18nValue('common.createTime'),
    prop: 'createTime'
  }
]
