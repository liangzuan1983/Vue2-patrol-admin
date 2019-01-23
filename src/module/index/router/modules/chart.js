import Layout from '@index/views/layout/Layout'

const chart = {
  path: '/charts',
  component: Layout,
  redirect: '/charts/alarmMap',
  name: 'charts',
  alwaysShow: true,
  meta: { title: 'charts', icon: 'map' },
  children: [
    { path: 'alarmMap', component: () => import('@index/views/charts/alarmMap'), name: 'alarmMap', meta: { title: 'alarmMap', noCache: true }},
    { path: 'alarmMapWPF', component: () => import('@index/views/charts/alarmMapWPF'), hidden: true, name: 'alarmMapWPF', meta: { title: 'alarmMapWPF', noCache: true }}
    // { path: 'keyboard', component: () => import('@index/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
    // { path: 'line', component: () => import('@index/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
    // { path: 'mixchart', component: () => import('@index/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }},
    // { path: 'test', component: () => import('@index/views/charts/test'), name: 'test', meta: { title: 'test', noCache: false }}
  ]

}
export default chart
