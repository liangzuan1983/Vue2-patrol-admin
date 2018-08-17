import Vue from 'vue'
import fancyBox from './fancyBox.vue'

const FancyBoxConstructor = Vue.extend(fancyBox)

Vue.directive('fancybox-thumbnail', {
  inserted(el, binding) {
    const style = el.getBoundingClientRect()
    const width = binding.value[0]
    const height = binding.value[1]
    const radio = style.width / style.height
    const type = width / height > radio ? 'height' : 'width'

    el.firstElementChild.style[type] = '100%'
  }
})

export default (el, imageList) => {
  imageList.forEach((n) => {
    const hRatio = window.innerWidth / n.width
    const vRatio = window.innerHeight / n.height
    n.scaleWidth = window.innerWidth
    n.fitRatio = hRatio < vRatio ? hRatio : vRatio
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
      webkitTransform: `translate3d(${boundingClientRect.left}px, ${boundingClientRect.top}px, 0px) scale(${zoom})`
    }

    if (instance.imageItems[instance.imageIndex].width < window.innerWidth) {
      instance.activeImageStyle = {
        width: '100%'
      }
    }

    setTimeout(() => {
      instance.activeImageStyle = {
        width: `${instance.getCenter().w}px`
      }

      instance.activeStyle = {
        webkitTransform: `translate3d(${instance.getCenter().x}px, ${instance.getCenter().y}px, 0px) scale(1)`
      }

      instance.initDom()
    }, 300)
  })
}