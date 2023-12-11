import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export function setupComponentsPlugin() {
  return Components({
    dirs: ['src/components'],
    // ui库解析器
    resolvers: [
      ElementPlusResolver({
        importStyle: 'sass'
      })
    ],
    extensions: ['vue'],
    // 配置文件生成位置
    dts: 'types/components.d.ts',
    directoryAsNamespace: true
  })
}
