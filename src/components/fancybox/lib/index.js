import Vue from 'vue'
import fancyBoxMain from './fancyBox.vue'

/* eslint-disable no-unused-vars */
const FancyBoxConstructor = Vue.extend(fancyBoxMain)

export default async(el, opt) => {
  const instance = new FancyBoxConstructor({
    el: document.createElement('div'),
    mounted() {
      this.visible = true
    }
  })
  document.body.appendChild(instance.$el)

  await new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = (response) => {
      resolve(img)
    }
    img.onerre = (err) => {
      reject(err)
    }
    /* deal for Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported */
    /* This will only work if you have the correct permissions, but will at least allow you to do what you want */
    // img.setAttribute('crossOrigin', 'Anonymous')
    img.src = opt.url
  }).then((img) => {
    const width = img.naturalWidth
    const height = img.naturalHeight
    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d')

    // canvas.width = width
    // canvas.height = height

    // ctx.drawImage(img, 0, 0, width, height)

    opt.width = width
    opt.height = height
    instance.activeUrl = img.src
    // try {
    //   instance.ImgBase64 = canvas.toDataURL('image/jpeg')
    // } catch (err) {
    //   instance.ImgBase64 = null
    //   console.info(err)
    // }
  }, () => {
    console.log('Error -- Image loading failed, 请检测你的网络')
  })

  // get zoom-ratio to fit the window
  const hRatio = window.innerWidth / opt.width
  const vRatio = window.innerHeight / opt.height
  opt.fitRatio = hRatio < vRatio ? hRatio : vRatio

  instance.options = Object.assign({}, instance.options, opt)

  const parent = el.parentNode
  instance.thumbnails = parent.parentNode.children

  const zoom = instance.getZoomTransform(el)
  const boundingClientRect = el.getBoundingClientRect()
  const c = instance.getCenter(0.8)

  instance.width = c.w
  instance.height = c.h

  instance.enterAndLeaveStyle = {
    webkitTransform: `translate3d(${boundingClientRect.left}px, ${boundingClientRect.top}px, 0px) scale(${zoom})`,
    msTransform: `translate3d(${boundingClientRect.left}px, ${boundingClientRect.top}px, 0px) scale(${zoom})`
  }

  instance.activeStyle = {
    webkitTransform: `translate3d(${c.x}px, ${c.y}px, 0px) scale(1)`,
    msTransform: `translate3d(${c.x}px, ${c.y}px, 0px) scale(1)`
  }

  instance.position = Object.assign({}, instance.position, {
    top: c.y,
    left: c.x,
    scale: 1
  })

  instance.loadingPic = false

  // done after dom updated
  Vue.nextTick(() => {

    // instance.initDom()
    // const boundingClientRect = parent.getBoundingClientRect()
    // instance.activeStyle = {
    //   webkitTransform: `translate3d(${boundingClientRect.left}px, ${boundingClientRect.top}px, 0px) scale(${zoom})`,
    //   msTransform: `translate3d(${boundingClientRect.left}px, ${boundingClientRect.top}px, 0px) scale(${zoom})`
    // }
  })
}
