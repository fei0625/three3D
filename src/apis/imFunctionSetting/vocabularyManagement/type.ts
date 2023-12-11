export interface ImVocabularyType {
  id: string
  code: string
  violationTypeId: string
  risk: number
  status: number
  markUser: {
    sensitiveUser: number
    type: number
    count: number
  }
  sensitive: string
  messageEffect: number
  accountEffect: {
    effect: number
    type: number
    count: number
  }[]
  createTime: string
  updateTime: string
  idList?: any
  violationType: string
}
export interface ImVocabularyQueryType extends Pick<ImVocabularyType, 'sensitive' | 'violationTypeId' | 'risk' | 'status'> {}

export interface ImViolationType {
  id: string
  name: string
  status: number
  createTime: string
  updateTime: string
  count: number
  triggerCount: number
  violatingUserCount: number
}
export interface ImViolationQueryType extends Pick<ImViolationType, 'name' | 'status'> {}
