import Layout from '@/views/layout/Layout'

const dataQuery = {
  path: '/dataQuery',
  name: 'dataQuery',
  component: Layout,
  redirect: '/dataQuery/gateSearch',
  alwaysShow: true,
  meta: { title: 'dataQuery', icon: 'dataQuery' },
  children: [
    { path: 'gateSearch', component: () => import('@/views/dataQuery/gateSearch'), name: 'gateSearch', meta: { title: 'gateSearch', noCache: false }},
    { path: 'identifiedPersonQuery', component: () => import('@/views/dataQuery/identifiedPersonQuery'), name: 'identifiedPersonQuery', meta: { title: 'identifiedPersonQuery', noCache: false }},
    { path: 'unidentifiedPersonQuery', component: () => import('@/views/dataQuery/unidentifiedPersonQuery'), name: 'unidentifiedPersonQuery', meta: { title: 'unidentifiedPersonQuery', noCache: false }},
    { path: 'carQuery', component: () => import('@/views/dataQuery/carQuery'), name: 'carQuery', meta: { title: 'carQuery', noCache: false }}
  ]
}
export default dataQuery
