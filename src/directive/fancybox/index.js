import fancybox from './fancybox'

const install = function(Vue) {
  // 绑定在image的时候，并没有调用
  Vue.directive('fancybox', fancybox)
}

if (window.Vue) {
  window['fancybox'] = fancybox
  Vue.use(install) // eslint-disable-line
}
fancybox.install = install
export default fancybox
