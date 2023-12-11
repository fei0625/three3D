interface ResponseResult<T> {
  code: number
  msg: string
  success: boolean
  data: T
}

interface PagesType<T> {
  records: T
  total: number
  size: number
  current: number
}
