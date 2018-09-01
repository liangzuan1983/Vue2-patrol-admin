export default {
  /* eslint-disable no-unused-vars */
  bind(el, binding, vnode) {
    const zoomRatio = 0.6 // 缩放速率

    el.style.cssText += ';cursor:move;'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getCSSStyle = (function() {
      if (window.document.currentStyle) {
        // IE fetching transfrom is matrix3d
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        // chrome fetching transfrom is matrix
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    /**
     * format 'matirx(1, ?, ?, 1, 100, 100)' or 'matrix3d(4.8, 0, 0, 0, 0, 4.8, 0, 0, 0, 0, 1, 0, -367.2, -1033.2, 0, 1)'
     * match the string
     * @param {String} str
     * @return {Boolean || Object}
     */
    const matchedMatrix = (str) => {
      const pattern = /(-?[1-9]\d*[\.\d+]*|-?0[\.\d+]*)/g
      if (str.indexOf('matrix3d') === 0) {
        return str.substring(8).match(pattern)
      } else if (str.indexOf('matrix') === 0) {
        return str.substring(6).match(pattern)
      } else {
        return []
      }
      // return eval(str)
    }

    const matrix = (...arg) => {
      return arg
    }
    /**
     * calculate scale translate from matirx
     * only adapt to the situation of css transform: translate(?, ?) scale(?)
     * [a c tx]
     * [b d ty]
     * [0 0  1]
     */
    const parseMatrix = (matrix) => {
      if (Array.isArray(matrix) && matrix.length === 6) {
        const a = matrix[0]
        const b = matrix[1]
        const c = matrix[2]
        const d = matrix[3]
        const tx = matrix[4]
        const ty = matrix[5]
        return {
          left: +tx,
          top: +ty,
          scale: +a
        }
      } else if (Array.isArray(matrix) && matrix.length === 16) {
        return {
          left: +matrix[12],
          top: +matrix[13],
          scale: +matrix[0]
        }
      }
    }

    /**
     * Based on the upper left corner of the image and make the image as the eventTarget,
     * calculate the distance between the trigger point and the origin,
     * times the preview zoom
     * @param {Boolean} left the translateX of image
     * @param {Boolean} top the translateY of image
     * @param {Boolean} scale
     * @param {Boolean} upOrDown
     * @param {Boolean} zoomRatio
     * @param {Number} eventX the event point`x offsetX
     * @param {Number} eventY the event point`y offsetY
     * *@return {Object} { left, top, scale }
     */
    const zoomAtPoint = ({ left, top, scale, upOrDown, eventX, eventY, zoomRatio }) => {
      let __scale = (1 + (-zoomRatio * upOrDown)) * scale

      /* minimum-scale = 1 */
      if (__scale <= 1) {
        __scale = 1
        zoomRatio = ((__scale / scale) - 1) / -upOrDown
      }

      left += upOrDown * (zoomRatio) * (eventX * scale)
      top += upOrDown * (zoomRatio) * (eventY * scale)

      scale = __scale
      return {
        left,
        top,
        scale
      }
    }

    let x_mousedown
    let y_mousedown
    let x_startPoint
    let y_startPoint
    let zoom_startPoint
    let moveFlag = false
    el.onmousedown = (event) => {
      const e = event || window.event

      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }

      if (e.button === 0) { // 左键
        moveFlag = true
        x_mousedown = e.screenX
        y_mousedown = e.screenY
        // when make the mouse down, calculate the distance between current Dom and visual window
        const { left, top, scale } = parseMatrix(matchedMatrix(getCSSStyle(el, 'transform')))
        x_startPoint = left
        y_startPoint = top
        zoom_startPoint = scale
      }
    }

    document.addEventListener('mousemove', (event) => {
      const e = event || window.event
      if (moveFlag) {
        el.classList.add('fangbox-moving')
        const f = e.screenX
        const d = e.screenY
        const h = f - x_mousedown
        const g = d - y_mousedown

        const left = +x_startPoint + h
        const top = +y_startPoint + g
        const scale = zoom_startPoint

        el.style['webkitTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        el.style['msTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`

        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
        return false
      }
    })

    document.addEventListener('mouseup', (event) => {
      const e = event || window.event
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }

      if (e.button === 0) {
        el.classList.remove('fangbox-moving')
        moveFlag = false
      }
    })

    let type = 'mousewheel'
    if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
      type = 'DOMMouseScroll'
    }
    el.addEventListener(type, (event) => {
      const e = event || window.event
      // when image is moving, no operation
      if (moveFlag) {
        return false
      }
      if (e.stopPropagation) {
        e.stopPropagation()
      }
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }
      const evtTarget = e.target || e.srcElement
      if (evtTarget.wheelTimeout) {
        return false
      }
      evtTarget.wheelTimeout = setTimeout(() => {
        evtTarget.wheelTimeout = null
      }, 200)
      // make the animate first, will bring a better experience
      const TYPE = event.type
      let delta
      if (TYPE === 'DOMMouseScroll' || TYPE === 'wheel' || TYPE === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta / 120 : -(e.detail || 0) / 3
      }
      const bool = delta === 0 ? 0 : ~~delta.toString().replace(/(-?).*/, '$11')

      const position = parseMatrix(matchedMatrix(getCSSStyle(el, 'transform')))
      const { left, top, scale } = zoomAtPoint({
        upOrDown: -bool,
        eventX: e.offsetX,
        eventY: e.offsetY,
        zoomRatio: zoomRatio,
        ...position
      })
      el.style['webkitTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
      el.style['msTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
    }, false)
  }
}
