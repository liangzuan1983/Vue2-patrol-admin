import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@object/views/layout/Layout'

export const constantRouterMap = [
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@object/views/dashboard'),
        name: 'dashboard',
        meta: { title: 'dashboard', roles: ['dashboard'], noCache: true, frequently: true }
      }
    ]
  }
]
/* global LOCAL_STATIC */
const base = LOCAL_STATIC + 'object'
export default new Router({
  // history more spa 多页面history模式
  mode: 'history', // require service support
  base, // based on mode "history"
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
