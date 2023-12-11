import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export function setupAutoImportPlugin() {
  return AutoImport({
    // 'vue', 'vue-router', 'vue-i18n', '@vueuse/head', '@vueuse/core
    imports: ['vue', 'vue-router'],
    resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
    dts: 'types/auto-import.d.ts',
    dirs: ['src/composables']
  })
}
