import { TableColumn } from '@/components/ms-table'
import { FormColumn, FormActionType } from '@/components/ms-form'
import { getI18nValue, getI18nNoUnknownValue } from '@/utils/i18n/index'
import MSIcon from '@/components/ms-icon/index.vue'
import { getTreeExceptF } from '@/apis/system/menu'
import { MenuType } from '@/apis/system/menu/type'
/**
 * menuType 字段描述
 *  N 导航 M  目录 C 菜单 F 按钮
 * 选择 N的时候需要不展示的字段
 * parentMenuId，icon，component，frameSrc
 * 选择 M的时候需要不展示的字段
 * frameSrc
 * 选择 C的时候需要不展示的字段
 * icon
 * 选择 F的时候需要不展示的字段
 * icon,component,frameSrc,hideMenu
 */

export const formColumns: FormColumn[] = [
  {
    prop: 'menuId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },

  {
    label: getI18nValue('sysMenu.menuType'),
    prop: 'menuType',
    component: 'RadioGroup',
    defaultValue: 'N',
    componentProps: ({ formAction }: { formAction: FormActionType }) => {
      return {
        option: [
          {
            label: getI18nValue('sysMenu.N'),
            value: 'N'
          },
          {
            label: getI18nValue('sysMenu.M'),
            value: 'M'
          },
          {
            label: getI18nValue('sysMenu.C'),
            value: 'C'
          },
          {
            label: getI18nValue('sysMenu.F'),
            value: 'F'
          }
        ],
        onChange: (e: string) => {
          if (e == 'M') {
            formAction.setPropValue('component', 'Layout')
          } else if (['C'].includes(e)) {
            formAction.setPropValue('component', '')
          }
        }
      }
    }
  },
  {
    label: getI18nValue('sysMenu.parentId'),
    prop: 'parentMenuId',
    component: 'ApiSelectTree',
    ifShow: ({ model }) => {
      if (model.menuType == 'N') {
        return false
      }
      return true
    },
    componentProps: {
      filterable: true,
      clearable: true,
      api: getTreeExceptF,
      props: {
        label: 'title',
        children: 'children',
        value: 'menuId'
      },
      renderContent: (h: any, { data }: { data: any }) => {
        data.label = getI18nNoUnknownValue(data.label)
        return h('span', null, data.label)
      }
    }
  },
  {
    label: getI18nValue('sysMenu.title'),
    prop: 'title',
    required: true,
    component: 'Input',
    componentProps: {
      maxlength: 50
    }
  },
  {
    label: getI18nValue('sysMenu.icon'),
    prop: 'icon',
    component: 'IconPicker',
    ifShow: ({ model }) => {
      if (['N', 'C', 'F'].includes(model.menuType)) {
        return false
      }
      return true
    }
  },
  {
    label: getI18nValue('common.sort'),
    prop: 'sort',
    component: 'InputNumber',
    defaultValue: 1,
    required: true,
    componentProps: {
      min: 1
    }
  },
  {
    label: getI18nValue('sysMenu.path'),
    prop: 'path',
    component: 'Input',
    required: true,
    componentProps: {
      maxlength: 255
    },
    tooltip: getI18nValue('sysMenu.pathDetails')
  },

  {
    label: getI18nValue('sysMenu.component'),
    prop: 'component',
    component: 'Input',
    ifShow: ({ model }) => {
      if (['N', 'F'].includes(model.menuType)) {
        return false
      }
      return true
    },
    componentProps: {
      maxlength: 60
    },

    tooltip: getI18nValue('sysMenu.componentDetails')
  },
  {
    label: getI18nValue('sysMenu.frameSrc'),
    prop: 'frameSrc',
    component: 'Input',
    ifShow: ({ model }) => {
      if (['N', 'M', 'F'].includes(model.menuType)) {
        return false
      }
      return true
    },
    componentProps: {
      maxlength: 255
    }
  },
  {
    label: getI18nValue('sysMenu.hideMenu'),
    prop: 'hideMenu',
    component: 'RadioGroup',
    defaultValue: '1',
    ifShow: ({ model }) => {
      if (['F'].includes(model.menuType)) {
        return false
      }
      return true
    },
    componentProps: {
      option: [
        {
          label: getI18nValue('sysMenu.show'),
          value: '1'
        },
        {
          label: getI18nValue('sysMenu.hide'),
          value: '0'
        }
      ]
    },
    tooltip: getI18nValue('sysMenu.hideMenuDetails')
  },
  {
    label: getI18nValue('common.description'),
    prop: 'menuDesc',
    component: 'InputTextArea',
    componentProps: {
      maxlength: 1024
    }
  }
]

export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('sysMenu.title'),
    prop: 'title',
    formatter(row: MenuType) {
      return getI18nNoUnknownValue(row.title)
    }
  },
  {
    label: getI18nValue('sysMenu.icon'),
    prop: 'icon',
    formatter(row: MenuType) {
      if (row.icon) return h(MSIcon, { icon: row.icon })
      else return ''
    },
    width: 50
  },
  {
    label: getI18nValue('sysMenu.path'),
    prop: 'path'
  },
  {
    label: getI18nValue('sysMenu.component'),
    prop: 'component'
  },
  {
    label: getI18nValue('sysMenu.menuType'),
    prop: 'menuType',
    formatter(row: MenuType) {
      if (!row.menuType) {
        return ''
      }
      return getI18nValue('sysMenu.' + row.menuType)
    }
  },
  {
    label: getI18nValue('common.sort'),
    prop: 'sort',
    width: 50
  }
]
