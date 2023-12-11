import { TableColumn } from '@/components/ms-table'
import { FormColumn } from '@/components/ms-form'
import { getI18nValue } from '@/utils/i18n'
import { useUserStore } from '@/stores/modules/user'
import { getRoleTree } from '@/apis/basic/role'
import { RoleType } from '@/apis/basic/role/type'
import { MenuType } from '@/apis/system/menu/type'

const userStore = useUserStore()
export const rolePermissionTree = ref<MenuType[]>([])

function ifShowAgentId() {
  const { agentId } = userStore.userInfo
  return agentId == -1
}

export async function getRolePermissionTree() {
  const { data } = await getRoleTree().send()
  rolePermissionTree.value = data
}

export const formColumns: FormColumn[] = [
  {
    prop: 'roleId',
    component: 'Input',
    componentProps: {
      type: 'hidden'
    }
  },
  {
    label: getI18nValue('role.roleName'),
    prop: 'roleName',
    component: 'Input',
    componentProps: {
      maxlength: 32
    },
    rules: {
      message: getI18nValue('role.roleName'),
      required: true
    }
  },
  {
    label: getI18nValue('role.roleType'),
    prop: 'roleType',
    component: 'Select',
    defaultValue: '2',
    ifShow: ifShowAgentId,
    componentProps: {
      option: [
        {
          label: getI18nValue('role.roleType1'),
          value: '1'
        },
        {
          label: getI18nValue('role.roleType2'),
          value: '2'
        }
      ]
    }
  },
  {
    label: getI18nValue('role.isAdmin'),
    prop: 'isAdmin',
    component: 'Select',
    defaultValue: '0',
    ifShow: ifShowAgentId,
    componentProps: {
      option: [
        {
          label: getI18nValue('common.no'),
          value: '0'
        },
        {
          label: getI18nValue('common.yes'),
          value: '1'
        }
      ]
    }
  },
  {
    label: getI18nValue('role.menuIdList'),
    prop: 'menuIdList',
    component: 'Select',
    slot: 'menuTree'
  }
]

export const searchColumns: FormColumn[] = [
  {
    prop: 'status',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('common.status'),
      option: [
        {
          label: getI18nValue('common.enable'),
          value: '1'
        },
        {
          label: getI18nValue('common.disable'),
          value: '0'
        }
      ]
    }
  },
  {
    prop: 'roleType',
    component: 'Select',
    componentProps: {
      placeholder: getI18nValue('role.roleType'),
      option: [
        {
          label: getI18nValue('role.roleType1'),
          value: '1'
        },
        {
          label: getI18nValue('role.roleType2'),
          value: '2'
        }
      ]
    }
  },
  {
    prop: 'roleName',
    component: 'Input',
    componentProps: {
      placeholder: getI18nValue('role.roleName')
    }
  }
]
export const tableColumns: TableColumn[] = [
  {
    label: getI18nValue('role.roleName'),
    prop: 'roleName'
  },
  {
    label: getI18nValue('role.roleType'),
    prop: 'roleType',
    formatter: (row: RoleType) => {
      if (!row.roleType) {
        return ''
      }
      return getI18nValue('role.roleType' + row.roleType)
    }
  },
  {
    label: getI18nValue('role.isAdmin'),
    prop: 'isAdmin',
    formatter: (row: RoleType) => {
      const adminTypeMap = {
        '0': getI18nValue('common.no'),
        '1': getI18nValue('common.yes')
      }
      return adminTypeMap[row.isAdmin as keyof typeof adminTypeMap] || ''
    }
  },
  {
    label: getI18nValue('common.status'),
    slot: 'status',
    showOverflowTooltip: false
  }
]
