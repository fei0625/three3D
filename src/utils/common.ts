//手机号码处理
export const hideMobile = (mobile: string): string => {
  if (mobile) {
    return mobile.replace(/^(\d{3})\d{4}(\d{0,4})$/, '$1****$2')
  } else {
    return ''
  }
}

//qq邮箱处理
export const hideEMail = (EMail: string): string => {
  return EMail.replace(/^(\w{0,3})\w*(@)\w*(\.)\w*$/, '$1***$2*$3*')
}
