export const getAppEnvConfig = (): ImportMetaEnv => {
  return window.msFast && Object.keys(window.msFast).length > 0 ? window.msFast : window.msConfig
}
/**
 *判断数据类型
 * @param params 数据
 * @param type 效验的类型
 * @returns boolean
 */
export function isType(params: unknown, type: string): boolean {
  return Object.prototype.toString.call(params) == '[object ' + type + ']' ? true : false
}

//防抖
export const debounce = (fn: Function, delay: number = 500) => {
  let debounceTimer: any = null
  return (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      fn.apply(null, args)
    }, delay)
  }
}
