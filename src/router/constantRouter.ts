import { PageEnum } from '@/enums/pageEnum'
import { RouteRecordRaw } from 'vue-router'
import { ErrorPage, Layout } from '@/router/constant'

export const constantRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: PageEnum.BASE_HOME,
    name: 'Root'
  },
  {
    path: PageEnum.BASE_LOGIN,
    component: () => import('@/views/login/index.vue')
  },
  {
    path: PageEnum.BASE_LOAD,
    component: () => import('@/views/exception/load.vue')
  },
  {
    path: PageEnum.BASE_HOME,
    component: Layout,
    redirect: PageEnum.BASE_HOME_REDIRECT,
    children: [
      {
        path: 'workplace',
        meta: {
          title: 'menu.work'
        },
        component: () => import('@/views/dashboard/workplace/index.vue')
      }
    ]
  }
]
// 404 on a page
export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: Layout,
  children: [
    {
      path: '/:path(.*)*',
      name: 'ErrorPageSon',
      component: ErrorPage,
      meta: {
        title: 'ErrorPage'
      }
    }
  ]
}
