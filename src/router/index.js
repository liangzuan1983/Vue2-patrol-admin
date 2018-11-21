import Vue from 'vue'
import Router from 'vue-router'

/* eslint-disable no-unused-vars */
Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import chart from './modules/chart'
import dataQuery from './modules/dataQuery'
import { iconsRouter } from './modules/else'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
 * ! Router lazyload (Import)
 * detail see: https://router.vuejs.org/zh/guide/advanced/lazy-loading.html
 * ! Components are loaded on demand. All components under a routing are packaged in the same asynchronous chunk
 * detail see: https://webpack.js.org/guides/code-splitting/
 * for example: component: () => import(\/* webpackChunkName: 'commonChunk' *\/'@/views/login/index')
 */

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached (<keep-alive>)(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/common-controller',
    component: Layout,
    redirect: '/common-controller/subSystemConfig',
    name: 'common-controller',
    alwaysShow: true,
    meta: { title: 'common-controller', icon: 'configuration' },
    children: [
      { path: 'subSystemConfig', component: () => import('@/views/common-controller/subSystemConfig'), name: 'subSystemConfig', meta: { title: 'subSystemConfig' }}
    ]
  },
  {
    path: '/alarm-controller',
    component: Layout,
    redirect: '/alarm-controller/alarmConfig',
    name: 'alarm-controller',
    alwaysShow: true,
    meta: { title: 'alarm-controller', icon: 'alarm' },
    children: [
      { path: 'alarmConfig', component: () => import('@/views/alarm-controller/alarmConfig'), name: 'alarmConfig', meta: { title: 'alarmConfig', noCache: false }},
      { path: 'alarmSearch', component: () => import('@/views/alarm-controller/alarmSearch'), name: 'alarmSearch', meta: { title: 'alarmSearch', noCache: false }}
    ]
  },
  chart,
  dataQuery,
  // iconsRouter,

  // some website which is not registered will be redirect to 404
  { path: '*', redirect: '/404', hidden: true }
]
