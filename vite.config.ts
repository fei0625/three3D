import { loadEnv, UserConfig, ConfigEnv } from 'vite'
import createPlugins from './viteConfig/plugins'
import { alias } from './viteConfig/resolve'
const Timestamp = Date.now() //随机时间戳

export default ({ command, mode }: ConfigEnv): UserConfig => {
  //command 可以根据'build' | 'serve'不同环境来配置
  const isBuild = command === 'build'
  //mode拿环境变量 development开发 |production 生产
  const root = process.cwd()
  const env = loadEnv(mode, root)
  return {
    plugins: createPlugins(isBuild, env),
    resolve: {
      alias
    },
    base: '/mesh_im/',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ` @use "@/styles/common.scss" as *;`
        }
      }
    },
    build: {
      // target: 'es2015',
      //编译时是否自动清空目录
      // emptyOutDir: true,
      // chunkSizeWarningLimit: 1000,
      commonjsOptions: {
        include: ['src/assets/ms-ui/ms-ui.common.js', /node_modules/]
      },
      rollupOptions: {
        output: {
          manualChunks(id: string): any {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
          chunkFileNames: `assets/js/[name].[hash]${Timestamp}.js`,
          entryFileNames: `assets/js/[name].[hash]${Timestamp}.js`,
          assetFileNames: `assets/[ext]/[name].[hash]${Timestamp}.[ext]`
        }
      }
      // minify: "terser", // 如果需要用terser混淆，可打开这两行
      // terserOptions: {
      //   compress: {
      //     keep_infinity: true,
      //     drop_console: true,
      //     drop_debugger: true,
      //   },
      // },
    }
  }
}
