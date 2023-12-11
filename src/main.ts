import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/index.scss'
import { setupRouter } from '@/router'
import { setupPinia } from '@/stores'
import { setupI18n } from '@/i18n'
import { setupGlobDirectives } from '@/directives'
function Bootstrap() {
  let app = createApp(App)

  //注册状态管理
  setupPinia(app)
  //注册路由
  setupRouter(app)
  //注册国际化
  setupI18n(app)
  // 注册全局指令
  setupGlobDirectives(app)

  app.mount('#app')
}
Bootstrap()
