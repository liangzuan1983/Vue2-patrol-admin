import drag from './drag'

const install = function(Vue) {
  Vue.directive('fancybox-drag', drag)
}

if (window.Vue) {
  window['fancybox-drag'] = drag
  Vue.use(install); // eslint-disable-line
}
drag.install = install
export default drag
