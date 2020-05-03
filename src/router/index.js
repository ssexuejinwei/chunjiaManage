import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '../views/_layout'

import store from '../store'

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters['user/isLogin']) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters['user/isLogin']) {
    next()
    return
  }
  next('/auth')
}

/** @type {import('vue-router').RouteConfig[]} */
const routes = [
  {
    path: '/',
    component: Layout,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home')
      },
      {
        path: '/teach',
        component: () => import('@/views/TeachSystem/index'),
        children: [
          // 学员管理
          {
            path: 'student',
            component: () => import('@/views/TeachSystem/student')
          },
          // 教练管理
          {
            path: 'coach',
            component: () => import('@/views/TeachSystem/coach')
          },
          // 队伍管理
          {
            path: 'team',
            component: () => import('@/views/TeachSystem/team')
          },
          // 课程管理
          {
            path: 'course',
            component: () => import('@/views/TeachSystem/course')
          },
          // 排课管理
          {
            path: 'schedule',
            component: () => import('@/views/TeachSystem/schedule')
          }
        ]
      },
      // 添加课程
      {
        path: '/teach/course/add',
        component: () => import('@/views/TeachSystem/components/courseAdd')
      },
      {
        path: '/teach/course/change',
        component: () => import('@/views/TeachSystem/components/courseEdit')
      },
      {
        path: '/teach/team/add',
        component: () => import('@/views/TeachSystem/components/teamAdd')
      },
      {
        path: '/teach/team/change',
        component: () => import('@/views/TeachSystem/components/teamEdit')
      },
      {
        path: '/user',
        component: () => import('@/views/UserManager/index')
      },
      {
        path: '/activity',
        component: () => import('@/views/Activity/index')
      },
      {
        path: '/activity/add',
        component: () => import('@/views/Activity/add')
      },
      {
        path: '/activity/:id',
        component: () => import('@/views/Activity/_id')
      },
      {
        path: '/product',
        component: () => import('@/views/Product/index')
      },
      {
        path: '/product/add',
        component: () => import('@/views/Product/add')
      },
      {
        path: '/product/edit/:id',
        component: () => import('@/views/Product/edit/_id')
      },
      {
        path: '/product/type',
        component: () => import('@/views/Product/type')
      },
      {
        path: '/order',
        component: () => import('@/views/Order/_layout'),
        children: [
          {
            path: '',
            component: () => import('@/views/Order/index')
          }
        ]
      },
      {
        path: '/score',
        component: () => import('@/views/Score/index'),
        children: [
          { path: '', redirect: 'overview' },
          {
            path: 'overview',
            component: () => import('@/views/Score/overview')
          },
          {
            path: 'recharge-record',
            component: () => import('@/views/Score/recharge')
          },
          {
            path: 'bill-record',
            component: () => import('@/views/Score/bill')
          },
          {
            path: 'return-record',
            component: () => import('@/views/Score/return')
          }
        ]
      }
    ]
  },

  {
    path: '/auth',
    component: () => import('@/views/Auth/index'),
    beforeEnter: ifNotAuthenticated
  },

  {
    path: '*',
    component: () => import('@/views/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
