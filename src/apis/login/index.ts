import { http } from '@/utils/alova/index'
import { LoginGoParamsType, LoginGoType, CaptchaGetType } from './type'

//获取滑动验证码
export const captchaGet = (data: { captchaType: string }) =>
  http.postRequest<CaptchaGetType>('/login/captchaGet', data, {
    headers: { skipErrorHandler: true }
  })

//校验滑动验证码
export const captchaCheck = (data: { captchaType: string; pointJson: string; token: string }) =>
  http.postRequest<{ captchaType: string; opAdmin: string; result: string; token: string }>('/login/captchaCheck', data, {
    headers: { skipErrorHandler: true }
  })

//滑动校验登录
export const captchGo = (data: LoginGoParamsType) =>
  http.postRequest<LoginGoType>('/login/captchGo', data, {
    headers: { skipErrorHandler: true }
  })

/**退出登陆 */
export const loginLogout = () => http.postRequest('/login/logout')
