import { captchGo } from '@/apis/login'
import { LoginGoParamsType, LoginStaffType } from '@/apis/login/type'
import { CacheEnumKey } from '@/enums/cacheEnum'
import { PageEnum } from '@/enums/pageEnum'
import { router } from '@/router/index'
import { get, remove, set } from '@/utils/cache'
import { getI18nValue } from '@/utils/i18n'
import { ElNotification } from 'element-plus'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const loginToken = ref<string>(get(CacheEnumKey.TOKEN_NAME) || '')
  const userInfo = ref<LoginStaffType>(get(CacheEnumKey.STAFF) ?? {})

  const login = async (params: LoginGoParamsType) => {
    try {
      const { data } = await captchGo(params).send()
      loginToken.value = data.staff.token
      userInfo.value = data.staff
      set(CacheEnumKey.TOKEN_NAME, data.staff.token)
      set(CacheEnumKey.STAFF, data.staff)
      set(CacheEnumKey.EXPIRATION, { expiration: data.expiration, notificationDuration: data.notificationDuration })
      router.push(PageEnum.BASE_HOME_REDIRECT)
      ElNotification.success({
        title: getI18nValue('login.loginSuccess'),
        message: `${getI18nValue('login.welcomeBack')}${data.staff.firstName}.${data.staff.lastName}`,
        offset: 60,
        duration: 2000
      })
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  const removeUserIonfo = () => {
    remove(CacheEnumKey.TOKEN_NAME)
    remove(CacheEnumKey.STAFF)
    remove(CacheEnumKey.SETLOCKSTATUS)
    remove(CacheEnumKey.EXPIRATION)
    loginToken.value = ''
    userInfo.value = {} as LoginStaffType
  }
  return { loginToken, userInfo, login, removeUserIonfo }
})
