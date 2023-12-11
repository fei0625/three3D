import { ElMessage } from 'element-plus'
import { useGlobalStore } from '@/stores/modules/global'
import { getLightColor, getDarkColor } from '@/utils/color'

/**
 * @description 全局主题 hooks
 * */
export const useTheme = () => {
  const globalStore = useGlobalStore()

  // 切换暗黑模式 ==> 同时修改主题颜色、侧边栏、头部颜色
  const switchDark = () => {
    const html = document.documentElement as HTMLElement
    if (globalStore.global.isDark) html.setAttribute('class', 'dark')
    else html.setAttribute('class', '')
    changePrimary(globalStore.global.primary)
  }

  // 修改主题颜色
  const changePrimary = (val: string | null) => {
    if (!val) {
      val = '#015cff'
      ElMessage({ type: 'success', message: `主题颜色已重置为 #015cff` })
    }
    // 计算主题颜色变化

    document.documentElement.style.setProperty('--ms-color', val)
    document.documentElement.style.setProperty('--el-color-primary', val)
    document.documentElement.style.setProperty(
      '--el-color-primary-dark-2',
      globalStore.global.isDark ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
    )
    for (let i = 1; i <= 9; i++) {
      const primaryColor = globalStore.global.isDark ? `${getDarkColor(val, i / 10)}` : `${getLightColor(val, i / 10)}`
      document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, primaryColor)
    }
  }

  // 灰色和弱色切换
  const changeGrey = () => {
    const body = document.body as HTMLElement
    if (!globalStore.global.isGrey) return body.removeAttribute('style')
    body.setAttribute('style', 'filter: grayscale(1)')
  }

  // init theme
  const initTheme = () => {
    changeSystem()
    // if (globalStore.global.isGrey) changeGrey()
  }
  const changeSystem = () => {
    if (globalStore.global.system == 1) {
      globalStore.global.isDark = true
    } else if (globalStore.global.system == 2) {
      const now = new Date()
      const currentHour = now.getHours()
      if (currentHour >= 6 && currentHour < 18) {
        globalStore.global.isDark = false
      } else {
        globalStore.global.isDark = true
      }
    } else if (globalStore.global.system == 3) {
      globalStore.global.isDark = false
    }
    switchDark()
  }
  return {
    initTheme,
    switchDark,
    changePrimary,
    changeGrey,
    changeSystem
  }
}
