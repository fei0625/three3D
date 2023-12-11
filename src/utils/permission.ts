import { useAsyncRouteStore } from '@/stores/modules/asyncRoute'

export const hasPermission = (auth?: string | string[]) => {
  const asyncRouteStore = useAsyncRouteStore()

  const value = auth
  let isAuth = false
  if (!value) return isAuth
  if (typeof value == 'string') {
    if (asyncRouteStore.authMap[value]) isAuth = true
    else isAuth = false
  }
  if (Array.isArray(value)) {
    const auth = value.some(item => asyncRouteStore.authMap[item])
    if (auth) isAuth = true
    else isAuth = false
  }
  return isAuth
}
