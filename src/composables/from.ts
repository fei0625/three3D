import { getI18nValue } from '@/utils/i18n'

//数字判断
export const sizeValidate = (min: number = 1, max: number = 999999999) => {
  return (r: any, v: any, callback: any) => {
    if ((v ?? 0) < min || (v ?? 0) > max) {
      callback(new Error(`${getI18nValue('form.inputRange')}:${min}~${max}`))
    } else {
      callback()
    }
  }
}
//ip地址效验
export const ip = (_r: any, v: any, callback: any) => {
  if (!/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))?$/.test(v)) {
    callback(new Error(getI18nValue('form.ip')))
  } else {
    callback()
  }
}
//mac效验
export const mac = (_r: any, v: any, callback: any) => {
  if (!/^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/.test(v)) {
    callback(new Error(getI18nValue('form.mac')))
  } else {
    callback()
  }
}

//密码效验
export const passwordValidity = (model: any) => {
  return (r: any, v: any, callback: any) => {
    if (!v) {
      callback(new Error(getI18nValue('form.codeCaseBlank')))
      return
    }
    if (v.length < 8 || v.length > 32) {
      callback(new Error(getI18nValue('form.codeCaseLength')))
    }
    if (model.staffCode == v || model.staffCode?.split('').reverse().join('') == v) {
      callback(new Error(getI18nValue('form.codeCaseCannot')))
    }
    let arrVerify = [
      { regName: 'Number', regValue: /[0-9]+/ },
      { regName: 'LowerCase', regValue: /[a-z]+/ },
      { regName: 'UpperCase', regValue: /[A-Z]+/ },
      { regName: 'SpecialCharacters', regValue: /[^a-zA-Z0-9]+/ }
    ]
    let regNum = 0 // 记录匹配的次数
    for (let iReg = 0; iReg < arrVerify.length; iReg++) {
      if (arrVerify[iReg].regValue.test(v)) {
        regNum = regNum + 1
      }
    }
    if (regNum <= 2) {
      callback(new Error(getI18nValue('form.codeCaseMust')))
    } else {
      callback()
    }
  }
}

//手机号码验证
export const mobileValidate = (r: any, v: any, callback: any) => {
  if (!v) {
    callback(new Error(getI18nValue('form.phoneBlank')))
  } else if (v.length < 7) {
    callback(new Error(getI18nValue('form.phoneEnter')))
  } else if (!/^\d+$/.test(v)) {
    callback(new Error(getI18nValue('form.phoneIncorrect')))
  } else {
    callback()
  }
}

//密码规则数据提示
export function passwordRules() {
  return `${getI18nValue('form.codeCase')}<br/>${getI18nValue('form.codeCase1')}<br/>${getI18nValue('form.codeCase2')}<br/>${getI18nValue(
    'form.codeCase3'
  )}<br/>${getI18nValue('form.codeCase4')}<br/>${getI18nValue('form.codeCase5')}<br/>${getI18nValue('form.codeCase6')}<br/>${getI18nValue(
    'form.codeCase7'
  )}~!@#$%^&*()-_+={}[]|/:;,.<>?`
}
