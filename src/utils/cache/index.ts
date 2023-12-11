type Type = 'local' | 'session'

/**
 *
 * @param key
 * @param value
 * @param type 存储类型
 */
export const set = (key: string, value: any, type: Type = 'local') => {
  if (type == 'local') {
    localStorage.setItem(key, JSON.stringify(value))
  }
  if (type == 'session') {
    sessionStorage.setItem(key, JSON.stringify(value))
  }
}

export const get = (key: string, type: Type = 'local', defaultValue: any = null) => {
  if (type == 'local') {
    const cacheStore = localStorage.getItem(key)
    if (cacheStore) {
      return JSON.parse(cacheStore)
    } else {
      return defaultValue
    }
  }
  if (type == 'session') {
    const cacheStore = sessionStorage.getItem(key)
    if (cacheStore) {
      return JSON.parse(cacheStore)
    } else {
      return defaultValue
    }
  }
}
export const remove = (key: string, type: Type = 'local') => {
  if (type == 'local') {
    localStorage.removeItem(key)
  }
  if (type == 'session') {
    sessionStorage.removeItem(key)
  }
}
