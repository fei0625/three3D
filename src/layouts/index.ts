import { useGlobalStore } from '@/stores/modules/global'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { get, set } from '@/utils/cache'
import { editPassword } from '@/apis/common'
import { useUserStore } from '@/stores/modules/user'
import { getI18nValue } from '@/utils/i18n'

const userStore = useUserStore()
export const globalStore = useGlobalStore()
interface expirationType {
  expiration: boolean
  notificationDuration: number
}
let timer: number | undefined
let timeout: number | undefined
export const isVisible = ref(false)
export const expiration = ref<expirationType>(get(CacheEnumKey.EXPIRATION))
export const resetPasswordData = reactive({
  params: {
    staffCode: userStore.userInfo.staffCode
  },
  api: editPassword,
  staffCode: userStore.userInfo.staffCode
})
export const timekeeping = () => {
  clearTimeout(timer)
  if (globalStore.lockStatus || globalStore.systemConfig.lockScreenFlag == 0) return
  // 设置不锁屏
  globalStore.lockStatus = false

  timer = setTimeout(
    () => {
      globalStore.lockStatus = true
    },
    globalStore.systemConfig.lockScreenTime * 60 * 1000
  )
}

//密码过期提醒
export function overduePrompt() {
  if (expiration.value.expiration) {
    timeout = setTimeout(() => {
      expiration.value.expiration = false
      set(CacheEnumKey.EXPIRATION, expiration.value)
    }, expiration.value.notificationDuration * 1000)
  }
}
export function handleExpirationClose() {
  expiration.value.expiration = false
  set(CacheEnumKey.EXPIRATION, expiration.value)
  clearTimeout(timeout)
}
export function handleExpirationOpen() {
  handleExpirationClose()
  isVisible.value = true
}
/**
 * 是否第一次登录
 */
export function getOneLogin() {
  const staff = get(CacheEnumKey.STAFF)
  if (staff && staff.oneLogin) {
    staff.oneLogin = false
    set(CacheEnumKey.STAFF, staff)
    new useMessageBox().MessageBox({
      message: getI18nValue('common.oneLogin'),
      beforeClose: (action, _instance, done) => {
        if (action == 'confirm') {
          isVisible.value = true
        }
        done()
      }
    })
  }
}
