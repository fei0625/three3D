import { RouteRecordRaw } from 'vue-router'
import { Layout } from '@/router/constant'

export const imFunctionSettingRouter: RouteRecordRaw[] = [
  {
    path: '/im/functionSetting',
    component: Layout,
    name: 'functionSetting',
    children: [
      {
        path: 'vocabularyManagement',
        name: 'vocabularyManagement',
        component: () => import('@/views/imFunctionSetting/vocabularyManagement/index.vue')
      }
    ]
  }
]

export const imSystemNumberNotification: RouteRecordRaw[] = [
  {
    path: '/im/systemNumberNotification',
    component: Layout,
    name: 'systemNumberNotification',
    children: [
      {
        path: 'fullUserNotification',
        name: 'fullUserNotification',
        component: () => import('@/views/imSystemNumberNotification/fullUserNotification/index.vue')
      },
      {
        path: 'notificationHistory',
        name: 'notificationHistory',
        component: () => import('@/views/imSystemNumberNotification/notificationHistory/index.vue')
      },
      {
        path: 'systemNumberManagement',
        name: 'systemNumberManagement',
        component: () => import('@/views/imSystemNumberNotification/systemNumberManagement/index.vue')
      }
    ]
  }
]

export const imOprtationRouter: RouteRecordRaw[] = [
  {
    path: '/im/operation',
    component: Layout,
    name: 'operation',
    children: [
      {
        path: 'groupManagement',
        name: 'groupManagement',
        component: () => import('@/views/imOperation/groupManagement/index.vue')
      },
      {
        path: 'userManagement',
        name: 'userManagement',
        component: () => import('@/views/imOperation/userManagement/index.vue')
      },
      {
        path: 'authorizationManagement',
        name: 'authorizationManagement',
        component: () => import('@/views/imOperation/authorizationManagement/index.vue')
      },
      {
        path: 'violationManagement',
        name: 'violationManagement',
        component: () => import('@/views/imOperation/violationManagement/index.vue')
      },
      {
        path: 'operationHistory',
        name: 'operationHistory',
        component: () => import('@/views/imOperation/operationHistory/index.vue')
      }
    ]
  }
]

export const imStatisticalRouter: RouteRecordRaw[] = [
  {
    path: '/im/statistical',
    component: Layout,
    name: 'statistical',
    children: [
      {
        path: 'userStatistical',
        name: 'userStatistical',
        component: () => import('@/views/imStatistical/userStatistical/index.vue')
      },
      {
        path: 'groupStatistics',
        name: 'groupStatistics',
        component: () => import('@/views/imStatistical/groupStatistics/index.vue')
      },
      {
        path: 'messageStatistics',
        name: 'messageStatistics',
        component: () => import('@/views/imStatistical/messageStatistics/index.vue')
      },
      {
        path: 'successRateStatistics',
        name: 'successRateStatistics',
        component: () => import('@/views/imStatistical/successRateStatistics/index.vue')
      },
      {
        path: 'audioVideoUsageStatistics',
        name: 'audioVideoUsageStatistics',
        component: () => import('@/views/imStatistical/audioVideoUsageStatistics/index.vue')
      }
    ]
  }
]
