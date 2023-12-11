import path from 'path'
import { Alias } from 'vite'
export const alias: Alias[] = [
  {
    find: '@',
    replacement: path.resolve(__dirname, '../src')
  }
]
