import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import { defineComponent } from 'vue'

export type Component<T = any> = ReturnType<typeof defineComponent> | (() => Promise<typeof import('*.vue')>) | (() => Promise<T>)

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  name?: string
  meta: RouteMeta
  component?: Component | string
  children?: AppRouteRecordRaw[]
  fullPath?: string
}

export interface IModuleType {
  default: Array<AppRouteRecordRaw> | AppRouteRecordRaw
}
