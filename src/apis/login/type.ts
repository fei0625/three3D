export interface LoginGoParamsType {
  staffCode: string
  password: string
  captchaVerification: string
}
export interface LoginStaffType {
  staffId: number
  staffCode: string
  orgId: number
  agentId: number
  firstName: string
  lastName: string
  password: string
  status: string
  passExpDate: string
  mobileNum: string
  email: string
  isAdmin: string
  isDelete: number
  reportCode: string
  lastLoginTime: string
  passwordUpdateTime: string
  createTime: string
  createBy: number
  updateTime: string
  updateBy: number
  token: string
  roleIdList?: any
  roleId?: any
  portalIdList?: any
  staffIdList?: any
  agentName: string
  originalPassword?: any
  orgName?: any
  oneLogin: boolean
  roleList?: any
  notStaffId?: any
  reportCodeList?: any
  image: string
  ipaddress?: any
}

export interface LoginGoType {
  lastLoginTime: string
  lockScreenFlag: number
  staff: LoginStaffType
  expiration: boolean
  notificationDuration: number
  lockScreenTime: number
}
export interface CaptchaGetType {
  captchaId?: any
  projectCode?: any
  captchaType?: any
  captchaOriginalPath?: any
  captchaFontType?: any
  captchaFontSize?: any
  secretKey: string
  originalImageBase64: string
  point?: any
  jigsawImageBase64: string
  wordList?: any
  pointList?: any
  pointJson?: any
  token: string
  result: boolean
  captchaVerification?: any
  clientUid?: any
  ts?: any
  browserInfo?: any
}

export interface CaptchaReqVO {
  captchaType: string
  browserInfo: string
  clientUid: string
  pointJson: string
  token: string
  captchaVerification: string
  xForwardedFor: string
  userAgent: string
  remoteAddr: string
  remoteHost: string
}

export interface CaptchaGetRespDataVO {
  captchaId: string
  projectCode: string
  captchaType: string
  captchaOriginalPath: string
  captchaFontType: string
  captchaFontSize: string
  secretKey: string
  originalImageBase64: string
  point: string
  jigsawImageBase64: string
  wordList: string
  pointList: string
  pointJson: string
  token: string
  result: boolean
  captchaVerification: string
  clientUid: string
  ts: string
  browserInfo: string
}

export interface loginVo {
  staffCode: string
  password: string
  lang: string
  imageCode: string
  codeToken: string
  captchaVerification: string
}
