import Vue from 'vue'
import fancyBox from './fancyBox.vue'

const FancyBoxConstructor = Vue.extend(fancyBox)

Vue.directive('fancybox-thumbnail', {
  inserted(el, binding) {
    const style = el.getBoundingClientRect()
    const width = binding.value[0]
    const height = binding.value[1]
    const ratio = style.width / style.height
    const type = width / height > ratio ? 'height' : 'width'

    el.firstElementChild.style[type] = '100%'
  }
})

export default (el, imageList) => {
  imageList.forEach((item) => {
    const hRatio = window.innerWidth / item.width
    const vRatio = window.innerHeight / item.height
    item.scaleWidth = window.innerWidth
    item.fitRatio = hRatio < vRatio ? hRatio : vRatio
  })

  const instance = new FancyBoxConstructor({
    el: document.createElement('div')
  })

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    const parent = el.parentNode

    instance.thumbnails = parent.parentNode.children
    instance.visible = true
    instance.imageItems = imageList
    instance.imageIndex = Number(parent.dataset.index)
    instance.activeUrl = instance.imageItems[instance.imageIndex].url

    const zoom = instance.getZoomTransform(el)
    const boundingClientRect = parent.getBoundingClientRect()

    instance.activeStyle = {
      webkitTransform: `translate3d(${boundingClientRect.left}px, ${boundingClientRect.top}px, 0px) scale(${zoom})`,
      msTransform: `translate3d(${boundingClientRect.left}px, ${boundingClientRect.top}px, 0px) scale(${zoom})`
    }

    if (instance.imageItems[instance.imageIndex].width < window.innerWidth) {
      instance.activeImageStyle = {
        width: '100%'
      }
    }

    setTimeout(() => {
      const c = instance.getCenter()
      instance.activeImageStyle = {
        width: `${c.w}px`
      }

      instance.activeStyle = {
        webkitTransform: `translate3d(${c.x}px, ${c.y}px, 0px) scale(1)`,
        msTransform: `translate3d(${c.x}px, ${c.y}px, 0px) scale(1)`
      }

      instance.initDom()
    }, 300)
  })
}
