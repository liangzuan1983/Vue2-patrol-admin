import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@object/styles/index.scss'

import App from './App'
import router from './router'
import '@/icons' // icon

import './mock' // simulation data

import * as filters from '@/filters' // global filters

import _ from 'lodash'
Vue.prototype._ = _

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
