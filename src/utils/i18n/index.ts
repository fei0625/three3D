import { i18n } from '@/i18n'

export function getI18nValue(key: string) {
  if (i18n.global.te(key)) {
    return i18n.global.t(key)
  } else {
    return i18n.global.t('common.unknownKey') + key
  }
}
export function getI18nNoUnknownValue(key: string) {
  if (i18n.global.te(key)) {
    return i18n.global.t(key)
  } else {
    return key
  }
}
