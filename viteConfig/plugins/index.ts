import vue from '@vitejs/plugin-vue'
import { Plugin } from 'vite'
import { setupComponentsPlugin } from './components'
import { setupAutoImportPlugin } from './autoImport'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
export default function createPlugins(isBuild: boolean, env: any) {
  const plugins: Plugin[] = [vue()]
  plugins.push(setupComponentsPlugin())
  plugins.push(setupAutoImportPlugin())
  plugins.push(
    viteCommonjs({
      include: ['src/assets/ms-ui/ms-ui.common.js']
    })
  )
  return plugins
}
