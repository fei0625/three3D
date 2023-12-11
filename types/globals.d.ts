declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module 'element-plus/dist/locale/en.mjs'
declare module '@/assets/ms-ui/ms-ui.common.js'
declare interface Tooltip {
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
  effect?: 'dark' | 'light'
  content: string
  offset?: number
  transition?: string
  showAfter?: string
  showArrow?: boolean
  hideAfter?: number
  autoClose?: number
  enterable?: boolean
  rawContent?: boolean
}
declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}
interface FilePathType {
  fileName: string
  fileSize: string
  filePath: string
  sign: string
}
interface ImportMetaEnv {
  readonly VITE_APP_URL: string
  readonly VITE_APP_UPLOAD: string
  readonly VITE_APP_PORT: string
  readonly VITE_APP_USESSL: string
  // 更多环境变量...
}
interface Window {
  getAccept: () => void
  getFilePath: (e: FilePath) => void
  timeUserFun: () => void
  msConfig: ImportMetaEnv
  msFast: ImportMetaEnv
}
