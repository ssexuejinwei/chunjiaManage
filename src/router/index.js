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
        path: '/grid',
        component: () => import('@/views/Grid/index')
      },
      {
        path: '/serveUser',
        component: () => import('@/views/ServeUser/index')
      },
      {
        path: '/medical',
        component: () => import('@/views/MedicalService/index')
      },
      {
        path: '/legal',
        component: () => import('@/views/LegalService/index')
      },
      {
        path: '/communityInfo',
        component: () => import('@/views/CommunityInfoManager/index')
      },
      {
        path: '/user',
        component: () => import('@/views/User/index')
      },
      {
        path: '/party1',
        component: () => import('@/views/PartyInfo/index1')
      },
      {
        path: '/party2',
        component: () => import('@/views/PartyInfo/index2')
      },
      {
        path: '/complaint',
        component: () => import('@/views/Complaint/index')
      },
      {
        path: '/shopping',
        component: () => import('@/views/Shopping/index1')
      },
      {
        path: '/couponUse',
        component: () => import('@/views/Shopping/index2')
      },
      {
        path: '/coupon',
        component: () => import('@/views/Shopping/index3')
      },
      {
        path: '/volunteer1',
        component: () => import('@/views/Volunteer/index1')
      },
      {
        path: '/volunteer2',
        component: () => import('@/views/Volunteer/index2')
      },
      {
        path: '/microCommunityInfo',
        component: () => import('@/views/CommunityMicroInfo/index')
      },
      {
        path: '/discuss1',
        component: () => import('@/views/Discuss/index1')
      },
      {
        path: '/discuss2',
        component: () => import('@/views/Discuss/index2')
      },
      {
        path: '/report',
        component: () => import('@/views/Report/index')
      },
      {
        path: '/work',
        component: () => import('@/views/Work/index')
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
