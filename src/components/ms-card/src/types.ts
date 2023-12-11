import type { ColProps, ButtonProps } from 'element-plus'
import { FormColumn } from '@/components/ms-form'

export interface CardColumn {
  label: string
  prop?: string
  formatter?: (row: any) => any
  slot?: string
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

export interface CardProps {
  cacheName?: string //缓存名称
  cardHeader: {
    name: string
    imageName: string | ((row: any) => string)
  } //card头
  cardColumns: CardColumn[]
  api?: Fn //请求接口
  cardData?: any //静态默认数据
  showPagination?: boolean //是否显示page分页
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
}

export interface CardActionType {
  // 设置表格属性
  setProps: (props: CardProps) => void
  //加载数据方法
  load: () => void
  computeTableHeight: () => void
  formGetValue: () => any
  formSetValue: (props: any) => void
  formUpdateFormColumn: (props: Partial<FormColumn> | Partial<FormColumn>[]) => void
}
