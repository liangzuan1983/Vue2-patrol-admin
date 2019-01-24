/*
 * File: fancybox.js
 * Project: robotmgr-web
 * File Created: Saturday, 19th January 2019 9:52:17 am
 * Author: KLEN (liangchuqiang@gosuncn.com)
 * Description:
 * -----
 * Last Modified: Thursday, 24th January 2019 9:11:35 pm
 * Modified By: KLEN (liangchuqiang@gosuncn.com>)
 * -----
 * Copyright 2018 - 2019 广州高新兴机器人有限公司, 广州高新兴机器人有限公司
 * -----
 */
import { on, off } from '@/utils/dom'
import fancyBoxMain from './lib'
function handleClick(event) {
  // if preventDefault exists run it on the original event
  if (event.preventDefault) { event.preventDefault() }
  // otherwise set the returnValue property of the original event to false (IE)
  event.returnValue = false

  const target = event.currentTarget
  fancyBoxMain(target, Object.assign({}, {
    url: target.href
  }))
}
function handleStopLink(event) {
  // if preventDefault exists run it on the original event
  if (event.preventDefault) { event.preventDefault() }
  // otherwise set the returnValue property of the original event to false (IE)
  event.returnValue = false
}
function openFancybox(el) {
  fancyBoxMain(el, Object.assign({}, {
    url: el.href
  }))
}
export default {
  bind(el, binding, vnode) {
    if (binding.value) {
      on(el, 'click', handleClick)
      vnode.context.$on('fancybox', openFancybox.bind(this, el))
    } else {
      on(el, 'click', handleStopLink)
    }
  },
  update(el, binding) {
    if (binding.oldValue !== binding.value) {
      if (binding.value) {
        on(el, 'click', handleClick)
      } else {
        off(el, 'click', handleClick)
      }
    }
  },
  unbind(el, binding, vnode) {
    vnode.context.$off('fancybox')
    off(el, 'click', handleClick)
    off(el, 'click', handleStopLink)
  }
}
