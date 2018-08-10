import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg组件
import generateIconsView from '@/views/svg-icons/generateIconsView.js'// just for @/views/icons , you can delete it

// register globally
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)

/**
 * Image format is 64*64 and color is #303133
 * download svg from iconfont, usually the property inside svg has a fixed value
 */
const req = require.context('./svg', false, /\.svg$/)
const iconMap = requireAll(req)
generateIconsView.generate(iconMap) // just for @/views/icons , you can delete it

