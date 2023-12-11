import { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuards } from './guards'
import { constantRouter } from './constantRouter'
import { imOprtationRouter, imFunctionSettingRouter, imStatisticalRouter, imSystemNumberNotification } from './imRouter'

//普通路由 无需验证权限
export const router = createRouter({
  history: createWebHistory('/mesh_im/'),
  routes: [...constantRouter, ...imOprtationRouter, ...imFunctionSettingRouter, ...imStatisticalRouter, ...imSystemNumberNotification]
})

export function setupRouter(app: App) {
  app.use(router)
  createRouterGuards(router)
}
