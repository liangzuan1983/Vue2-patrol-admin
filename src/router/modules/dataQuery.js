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
    { path: 'personQuery', component: () => import('@/views/dataQuery/personQuery'), name: 'personQuery', meta: { title: 'personQuery', noCache: false }},
    { path: 'carQuery', component: () => import('@/views/dataQuery/carQuery'), name: 'carQuery', meta: { title: 'carQuery', noCache: false }}
  ]
}
export default dataQuery
