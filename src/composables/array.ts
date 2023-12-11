/**
 * 数组对象去重
 * @param  params 数组
 * @param  name 根据那个名称去重
 * @returns Array
 *
 */

export function uniqBy<T>(params: T[], name: string): T[] {
  const map = new Map()
  if (!Array.isArray(params)) {
    return params
  }
  return params.filter((item: any) => !map.has(item[name]) && map.set(item[name], item))
}

/**
 * 数组去重
 * @param  params 数组
 * @return Array
 */
export function dedupe<T>(params: T[]): T[] {
  return [...new Set(params)]
}

/**
 *
 * @param array 要分组的数组
 * @param subNum  分成多少分
 * @returns
 */
export function group<T>(array: T[], subNum: number): T[] {
  let index = 0
  let newArray: any = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subNum)))
  }
  return newArray
}
/**
 * tree装list
 * @param  params 数组
 * @param  childrenName 参数
 * @return Array
 */
export function treeList<T>(params: T[], childrenName: string = 'children'): T[] {
  if (!Array.isArray(params)) {
    return []
  }
  const list: any = []
  const queue = deepCopy(params)
  while (queue.length) {
    const node: any = queue.shift()
    const children = node[childrenName]
    if (children) {
      queue.push(...children)
    }
    list.push(node)
  }
  return list
}

/**
 * list转tree
 * @param  params 数组
 * @param  option 参数
 * @return Array
 */

export function listTree<T>(
  params: T[],
  option: { pid: string; children: string; id: string } = {
    pid: 'pid',
    id: 'id',
    children: 'children'
  }
): T[] {
  if (!Array.isArray(params)) {
    return []
  }
  let newArr = deepCopy(params)
  for (let i = 0; i < newArr.length; i++) {
    const child: any = newArr[i]
    const pid = child[option.pid]
    if (pid) {
      for (let j = 0; j < newArr.length; j++) {
        const parent: any = newArr[j]
        if (parent[option.id] === pid) {
          parent[option.children] = parent[option.children] || []
          parent[option.children].push(child)
        }
      }
    }
  }

  return newArr.filter((n: any) => !n[option.pid])
}
