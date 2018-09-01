import drag from './drag'

const install = function(Vue) {
  // 绑定在image的时候，并没有调用
  console.log('Vue', Vue)
  Vue.directive('fancybox', drag)
}

if (window.Vue) {
  window['fancybox'] = drag
  Vue.use(install); // eslint-disable-line
}
drag.install = install
export default drag
