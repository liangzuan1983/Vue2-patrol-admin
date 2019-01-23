import Layout from '@index/views/layout/Layout'

const dataQuery = {
  path: '/dataQuery',
  name: 'dataQuery',
  component: Layout,
  redirect: '/dataQuery/gateSearch',
  alwaysShow: true,
  meta: { title: 'dataQuery', icon: 'dataQuery' },
  children: [
    { path: 'gateSearch', component: () => import('@index/views/dataQuery/gateSearch'), name: 'gateSearch', meta: { title: 'gateSearch', noCache: false }},
    { path: 'identifiedPersonQuery', component: () => import('@index/views/dataQuery/identifiedPersonQuery'), name: 'identifiedPersonQuery', meta: { title: 'identifiedPersonQuery', noCache: false }},
    { path: 'unidentifiedPersonQuery', component: () => import('@index/views/dataQuery/unidentifiedPersonQuery'), name: 'unidentifiedPersonQuery', meta: { title: 'unidentifiedPersonQuery', noCache: false }},
    { path: 'carQuery', component: () => import('@index/views/dataQuery/carQuery'), name: 'carQuery', meta: { title: 'carQuery', noCache: false }}
  ]
}
export default dataQuery
