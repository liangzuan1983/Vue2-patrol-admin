import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

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
  {
    path: '/charts',
    component: Layout,
    redirect: '/charts/alarmMap',
    name: 'charts',
    alwaysShow: true,
    meta: { title: 'charts', icon: 'map' },
    children: [
      { path: 'alarmMap', component: () => import('@/views/charts/alarmMap'), name: 'alarmMap', meta: { title: 'alarmMap', noCache: true }},
      { path: 'alarmMapWPF', component: () => import('@/views/charts/alarmMapWPF'), hidden: true, name: 'alarmMapWPF', meta: { title: 'alarmMapWPF', noCache: true }},
      { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
      { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
      { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }},
      { path: 'test', component: () => import('@/views/charts/test'), name: 'test', meta: { title: 'test', noCache: false }}
    ]
  },
  {
    path: '/gate-machine-controller',
    name: 'gate-machine-controller',
    component: Layout,
    redirect: '/gate-machine-controller/gateSearch',
    meta: { title: 'gate-machine-controller', icon: 'alarm' },
    children: [
      { path: 'gateSearch', component: () => import('@/views/gate-machine-controller/gateSearch'), name: 'gateSearch', meta: { title: 'gateSearch', icon: 'gate', noCache: false }}
      // { path: 'gateSearch2', component: () => import('@/views/gate-machine-controller/gateSearch2'), hidden: true, name: 'gateSearch2', meta: { title: 'gateSearch2', icon: 'gate', noCache: false }}
    ]
  },
  {
    path: '/components',
    alwaysShow: true,
    component: Layout,
    redirect: 'noredirect',
    name: 'component-demo',
    meta: {
      title: 'components',
      icon: 'component'
    },
    children: [
      // { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), hidden: true, name: 'tinymce-demo', meta: { title: 'tinymce' }},
      // { path: 'markdown', component: () => import('@/views/components-demo/markdown'), hidden: true, name: 'markdown-demo', meta: { title: 'markdown' }},
      // { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), hidden: true, name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
      // { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), hidden: true, name: 'splitpane-demo', meta: { title: 'splitPane' }},
      // { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), hidden: true, name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
      // { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), hidden: true, name: 'dropzone-demo', meta: { title: 'dropzone' }},
      // { path: 'sticky', component: () => import('@/views/components-demo/sticky'), hidden: true, name: 'sticky-demo', meta: { title: 'sticky' }},
      // { path: 'count-to', component: () => import('@/views/components-demo/countTo'), hidden: true, name: 'countTo-demo', meta: { title: 'countTo' }},
      // { path: 'mixin', component: () => import('@/views/components-demo/mixin'), hidden: true, name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
      // { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), hidden: true, name: 'backToTop-demo', meta: { title: 'backToTop' }},
      // { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), hidden: true, name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
      // { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), hidden: true, name: 'dndList-demo', meta: { title: 'dndList' }},
      { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/svg-icons/index'),
      name: 'icons',
      meta: { title: 'icons', icon: 'icon', noCache: true }
    }]
  },
  // some website which is not registered will be redirect to 404
  { path: '*', redirect: '/404', hidden: true }
]
