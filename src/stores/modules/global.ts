import { getSystemConfig } from '@/apis/common'
import { SystemConfigType } from '@/apis/common/type'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { get, set } from '@/utils/cache'
import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  //获取本地配置
  const global = ref<{
    language: string
    primary: string
    isDark: boolean
    isGrey: boolean
    tabs: boolean
    footer: boolean
    system: number
  }>(
    get(CacheEnumKey.GLOBAL) ?? {
      // 当前系统语言
      language: 'en_US',
      // 主题颜色
      primary: '#015cff',
      // 深色模式
      isDark: false,
      // 灰色模式
      isGrey: false,
      // 标签页
      tabs: true,
      // 页脚
      footer: false,
      //是否自动切换颜色
      system: 3
    }
  )
  //获取服务器系统配置
  const systemConfig = ref({} as SystemConfigType)
  const initystemConfig = async () => {
    let { data } = await getSystemConfig().send()
    systemConfig.value = data
  }
  //锁屏状态
  const lockStatus = ref<boolean>(get(CacheEnumKey.SETLOCKSTATUS) ?? false)

  watch(
    global,
    () => {
      set(CacheEnumKey.GLOBAL, global.value)
    },
    { deep: true }
  )
  watch(lockStatus, () => {
    set(CacheEnumKey.SETLOCKSTATUS, lockStatus.value)
  })
  return {
    global,
    initystemConfig,
    systemConfig,
    lockStatus
  }
})
