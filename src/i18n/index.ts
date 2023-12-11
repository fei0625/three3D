import { createI18n } from 'vue-i18n'
import { App } from 'vue'
import { get } from '@/utils/cache'
import { CacheEnumKey } from '@/enums/cacheEnum'
const modules: Record<string, { default: { zh: Record<string, any>; en: Record<string, any> } }> = import.meta.glob('./modules/**/*.ts', { eager: true })
const messages = {
  ['zh_CN']: {},
  ['en_US']: {}
}
for (const path in modules) {
  const { zh, en } = modules[path].default
  messages['zh_CN'] = { ...messages['zh_CN'], ...zh }
  messages['en_US'] = { ...messages['en_US'], ...en }
}
const locale = get(CacheEnumKey.GLOBAL)?.language ?? 'en_US'
export const i18n = createI18n({
  // legacy: false,
  fallbackLocale: locale,
  locale: locale,
  messages
})

export const setupI18n = async (app: App) => {
  app.use(i18n)
}
