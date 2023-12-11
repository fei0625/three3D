import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es'

/**
 *判断对象中是否有这个属性
 * @param params  原始对象
 * @param key 检测的key
 * @returns boolean
 */
export function hasOwnObjectProperty(params: object, key: string): boolean {
  return key in params
}

/**
 * 比较两个对象属性是否相等
 * @param a 对象
 * @param b 对象
 * @returns boolean
 */
export function isObjectEqual(a: object, b: object): boolean {
  if (!(isType(a, 'Object') && isType(b, 'Object'))) {
    return false
  }
  let aProps = Object.getOwnPropertyNames(a)
  let bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) {
    return false
  }
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]
    if (a[propName as keyof typeof a] !== b[propName as keyof typeof b]) {
      return false
    }
  }
  return true
}

/**
 *  对象深拷贝
 * @param params 对象｜数组
 * @return Object |array
 */
export function deepCopy<T>(params: T): T {
  if (!(Array.isArray(params) || isType(params, 'Object'))) {
    return params
  }
  let copy: any
  if (typeof params !== 'object' || params === null) {
    copy = params
  } else if (Array.isArray(params)) {
    copy = []
    for (let i = 0; i < params.length; i++) {
      const d = params[i]
      copy.push(deepCopy(d))
    }
  } else {
    copy = {}
    for (let key in params) {
      copy[key] = deepCopy(params[key])
    }
  }
  return copy
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace'
): T & U {
  if (!target) {
    return source as T & U
  }
  if (!source) {
    return target as T & U
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isType(targetValue, 'Array') && isType(sourceValue, 'Array')) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual)
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual)
        case 'concat':
          return sourceValue.concat(targetValue)
        case 'replace':
          return targetValue
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`)
      }
    }

    if (isType(targetValue, 'Object') && isType(sourceValue, 'Object')) {
      return deepMerge(sourceValue, targetValue, mergeArrays)
    }
    return undefined
  })
}
