import Layout from '@/views/layout/Layout'

const chart = {
  path: '/charts',
  component: Layout,
  redirect: '/charts/alarmMap',
  name: 'charts',
  alwaysShow: true,
  meta: { title: 'charts', icon: 'map' },
  children: [
    { path: 'alarmMap', component: () => import('@/views/charts/alarmMap'), name: 'alarmMap', meta: { title: 'alarmMap', noCache: true }},
    { path: 'alarmMapWPF', component: () => import('@/views/charts/alarmMapWPF'), hidden: true, name: 'alarmMapWPF', meta: { title: 'alarmMapWPF', noCache: true }}
    // { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
    // { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
    // { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }},
    // { path: 'test', component: () => import('@/views/charts/test'), name: 'test', meta: { title: 'test', noCache: false }}
  ]

}
export default chart
