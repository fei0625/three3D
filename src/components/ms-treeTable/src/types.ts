import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import type { ColProps, ButtonProps } from 'element-plus'
import { FormColumn } from '@/components/ms-form'

export interface TableColumn<T = any> extends Partial<TableColumnCtx<T>> {
  slot?: string
  slotHeader?: string
}

export interface ActionItem extends Partial<Omit<ButtonProps, 'autofocus' | 'native-type' | 'loadingIcon' | 'icon'>> {
  //事件
  onClick: Fn
  //按钮文本
  label?: string
  //图标颜色
  // 按钮图标
  icon?: string
  //loading图标
  loadingIcon?: string
  // 权限编码控制是否显示
  auth?: string | string[]
  // 业务控制是否显示
  ifShow?: boolean | ((row: any) => boolean)
  tooltip?: string | Tooltip
}

export interface TableProps {
  cacheName?: string //缓存名称
  tableColumns: TableColumn[] //表格头
  api?: Fn //请求接口
  isAutoHeight?: boolean //高度是否自适应
  resizeHeightOffset?: number //调整高度偏移
  searchColumns?: FormColumn[] //查询条件
  extrasSearchParams?: object //额外的查询参数
  formColProps?: Partial<ColProps> //form 表单每个元素的展位格子
  isImmediate?: boolean //是否立即请求接口
  onBeforeLoad?: (params: any) => object //请求前的方法只返回搜索参数
  onSuccess?: (data: any) => any[] //请求成功的方法
  isSearchBtn?: boolean //是否显示搜索按钮
  isResetBtn?: boolean //是否显示重置按钮
  resetParams?: string[] //只需要重置哪些字段
  onResetSuccess?: (data: any) => void | any //重置成功的方法
  isMore?: boolean //是否显示展开按钮
  actionColumn?: ActionItem[] //操作按钮
  actionConfig?: Pick<TableColumn, 'fixed' | 'width' | 'minWidth' | 'align'> //操作按钮配置
  treeOption: {
    pid: string
    id: string
    children: string
  }
  rowKey: string
}

/**其他方法查看element table的方法 */
export interface TableActionType {
  // 设置表格属性
  setProps: (props: TableProps) => void
  //加载数据方法
  load: () => void
  clearSelection: () => void
  getSelectionRows: () => any
  toggleRowSelection: (row: any, selected: boolean) => void
  toggleAllSelection: () => void
  toggleRowExpansion: (row: any, expanded: boolean) => void
  setCurrentRow: (row: any) => void
  clearSort: () => void
  clearFilter: (columnKeys: string[]) => void
  doLayout: () => void
  sort: (prop: string, order: string) => void
  scrollTo: (options: number | ScrollToOptions, yCoord?: number | undefined) => void
  setScrollLeft: (left?: number | undefined) => void
  setScrollTop: (top?: number | undefined) => void
  computeTableHeight: () => void
  formGetValue: () => any
  formSetValue: (props: any) => void
  formUpdateFormColumn: (props: Partial<FormColumn> | Partial<FormColumn>[]) => void
  isChildren: (id: any) => Promise<boolean>
}
