/**
 * @author linagchuq
 * TODO 实现了 滚轮定点缩放
 * TODO 实现了 鼠标移动
 * TODO 实现了 边缘回弹检测
 * TODO 未实现 边缘移动抵抗反应检测
 */
import { addEvent, removeEvent } from '@/utils/event'
export default {
  /* eslint-disable no-unused-vars */
  bind(el, binding, vnode) {
    const zoomRatio = 0.6 // 缩放速率

    el.style.cssText += ';cursor:move;'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getCSSStyle = (function() {
      if (document.documentElement.currentStyle) {
        // IE fetching transfrom is matrix3d
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        // chrome fetching transfrom is matrix
        return (dom, attr) => {
          const a = getComputedStyle(dom, null)
          return a[[attr]]
        }
      }
    })()

    const transitionEnd = (dom, callback) => {
      const events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd']
      let i
      function fireCallBack(e) {
        /* jshint validthis:true */
        if (e.target !== this) return
        callback.call(this, e)
        for (i = 0; i < events.length; i++) {
          // dom.off(events[i], fireCallBack)
          removeEvent(dom, events[i], fireCallBack)
        }
      }
      if (callback) {
        for (i = 0; i < events.length; i++) {
          // dom.on(events[i], fireCallBack)
          addEvent(dom, events[i], fireCallBack)
        }
      }
      return this
    }

    /**
     * fetch the axis inside of transform from el
     * @param {DOMElement} el
     * @param {string} axis
     */
    const getTranslate = function(el, axis) {
      var matrix, curTransform, curStyle, transformMatrix

      // automatic axis detection
      if (typeof axis === 'undefined') {
        axis = 'x'
      }

      curStyle = window.getComputedStyle(el, null)
      if (window.WebKitCSSMatrix) {
      // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case
        transformMatrix = new window.WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform)
      } else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,')
        matrix = transformMatrix.toString().split(',')
      }

      if (axis === 'x') {
      // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) {
          curTransform = transformMatrix.m41
        } else if (matrix.length === 16) {
          // Crazy IE10 Matrix
          curTransform = parseFloat(matrix[12])
        } else {
          // Normal Browsers
          curTransform = parseFloat(matrix[4])
        }
      }
      if (axis === 'y') {
      // Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix) {
          curTransform = transformMatrix.m42
        } else if (matrix.length === 16) {
          // Crazy IE10 Matrix
          curTransform = parseFloat(matrix[13])
        } else {
          // Normal Browsers
          curTransform = parseFloat(matrix[5])
        }
      }

      return curTransform || 0
    }

    const _requestAnimationFrame = (callback) => {
      if (window.requestAnimationFrame) return window.requestAnimationFrame(callback)
      else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback)
      else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback)
      else {
        return window.setTimeout(callback, 1000 / 60)
      }
    }

    const _cancelAnimationFrame = function(id) {
      if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id)
      else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id)
      else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id)
      else {
        return window.clearTimeout(id)
      }
    }

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

    const NORMAL = 2
    const TO_X = 1
    const TO_Y = -1
    /**
     * 计算矢量方向
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     */
    const calculateDirection = (x1, y1, x2, y2) => {
      const x = x2 - x1
      const y = y2 - y1
      let STATUS
      const t = calculateAngle([x, y])
      if (x > 0 && y > 0) {
        STATUS = t === NORMAL ? 2 : t === TO_X ? 5 : 6
      } else if (x > 0 && y < 0) {
        STATUS = t === NORMAL ? 1 : t === TO_X ? 5 : 8
      } else if (x < 0 && y < 0) {
        STATUS = t === NORMAL ? 4 : t === TO_X ? 7 : 8
      } else if (x < 0 && y > 0) {
        STATUS = t === NORMAL ? 3 : t === TO_X ? 7 : 6
      } else if (x > 0 && y === 0) {
        STATUS = 5
      } else if (x < 0 && y === 0) {
        STATUS = 7
      } else if (x === 0 && y > 0) {
        STATUS = 6
      } else if (x === 0 && y < 0) {
        STATUS = 8
      }
      return STATUS
    }

    /**
     * calculate the angle between tow vectors
     * a(x1, y1) b(x2, y2) cos<a,b>=a.b/|a||b|
     * @param {Array} arr
     * @return {Number} 1 or -1
     *  1 is on behalf of the angle is less than SLIGHTANGLE or more than 180-SLIGHTANGLE
     * -1 is on behalf of the angle is more than 90 - SLIGHTANGLE and less than 90 + SLIGHTANGLE
     *  2 is behalf of normal situation
     */
    const originVector = [100, 0]
    const SLIGHTANGLE = 0
    const calculateAngle = (arr) => {
      if (!Array.isArray(arr) || arr.length !== 2) {
        return false
      }
      const x1 = originVector[0]
      const y1 = originVector[1]
      const x2 = arr[0]
      const y2 = arr[1]

      const cos = (x1 * x2 + y1 * y2) / (Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)))
      const angle = Math.acos(cos) * 180 / Math.PI

      if (angle < SLIGHTANGLE ||
        angle > 180 - SLIGHTANGLE
      ) {
        return 1
      } else if (angle > 90 - SLIGHTANGLE && angle < 90 + SLIGHTANGLE) {
        return -1
      } else {
        return 2
      }
    }

    /**
     * judge whether the transform is out of the visual window
     *
     */
    const calculateOutBound = () => {
      let awayfrom_x = false // when the width of bigger picture is `more` than innerwidth and out of rang, this value is valid
      let awayform_y = false // when the height of bigger picture is `more` than innerHeight and out of rang, this value is valid
      let exceed_x = false // when the width of bigger picture is `less` than innerHeight and out of rang, this value is valid
      let exceed_y = false // when the height of bigger picture is `less` than innerHeight and out of rang, this value is valid
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight
      const { left, top, scale } = parseMatrix(matchedMatrix(getCSSStyle(el, 'transform')))
      const picWidth = el.width
      const picHeight = el.height

      if ((picWidth * scale) > winWidth) {
        if (left > 0 || (picWidth * scale + left) < winWidth) {
          awayfrom_x = true
        }
      } else {
        if (left < 0 || (picWidth * scale + left) > winWidth) {
          exceed_x = true
        }
      }
      if ((picHeight * scale) > winHeight) {
        if (top > 0 || (picHeight * scale + top) < winHeight) {
          awayform_y = true
        }
      } else {
        if (top < 0 || (picHeight * scale + top) > winHeight) {
          exceed_y = true
        }
      }

      return {
        awayfrom_x,
        awayform_y,
        exceed_x,
        exceed_y
      }
    }

    /**
     * calculate the adjusting position when the transform is out of visual window
     * @param {Number} direction 移动方向
     * @return {Object} position
     */
    const calculateAdjustingRangs = (direction) => {
      const { left, top, scale } = parseMatrix(matchedMatrix(getCSSStyle(el, 'transform')))
      const winWidth = window.innerWidth
      const winHeight = window.innerHeight
      const picWidth = el.width
      const picHeight = el.height

      let _left = left
      let _top = top
      if (!direction) {
        return { left, top, scale }
      }
      const { awayfrom_x, awayform_y, exceed_x, exceed_y } = calculateOutBound()

      switch (direction) {
        case 1:
          _left = 0
          _top = -(picHeight * scale - winHeight)
          break
        case 2:
          _left = 0
          _top = 0
          break
        case 3:
          _left = -(picWidth * scale - winWidth)
          _top = 0
          break
        case 4:
          _left = -(picWidth * scale - winWidth)
          _top = -(picHeight * scale - winHeight)
          break
        case 5:
          _left = 0
          _top = top
          break
        case 6:
          _left = left
          _top = 0
          break
        case 7:
          _left = -(picWidth * scale - winWidth)
          _top = top
          break
        case 8:
          _left = left
          _top = -(picHeight * scale - winHeight)
          break
      }
      /* judge whether to exceed the horizontal distance or the vertical distance */
      _left = awayfrom_x ? _left : left
      _top = awayform_y ? _top : top

      const tempX = _left
      const tempY = _top

      switch (direction) {
        case 1:
          _left = winWidth - picWidth * scale
          _top = 0
          break
        case 2:
          _left = winWidth - picWidth * scale
          _top = winHeight - picHeight * scale
          break
        case 3:
          _left = 0
          _top = winHeight - picHeight * scale
          break
        case 4:
          _left = 0
          _top = 0
          break
        case 5:
          _left = winWidth - picWidth * scale
          _top = top
          break
        case 6:
          _left = left
          _top = winHeight - picHeight * scale
          break
        case 7:
          _left = 0
          _top = top
          break
        case 8:
          _left = left
          _top = 0
          break
      }

      _left = exceed_x ? _left : tempX
      _top = exceed_y ? _top : tempY

      return {
        _left,
        _top,
        scale
      }
    }

    const TWEEN = require('@/utils/tween.js')
    const animate = (function(f) {
      var value
      var active = false
      var accumulated = []

      return async function accumulator() {
        accumulated.push(arguments)
        if (!active) {
          active = true
          while (accumulated.length) {
            value = await f.apply(this, accumulated.shift())
          }
          active = false
          return value
        }
      }
    })(function(from, to, dom) {
      return new Promise((resolve, reject) => {
        if (from === undefined || to === undefined) {
          return reject()
        }
        /* first situation */
        // do the animate transform(asynchronous)
        // let animationSwitch
        // function next(timer) {
        //   animationSwitch = _requestAnimationFrame(next)
        //   TWEEN.update(timer)
        // }
        // animationSwitch = _requestAnimationFrame(next)

        // const start = Object.assign({}, from)
        // const end = Object.assign({}, to)
        // const tween = new TWEEN.Tween(start)
        //   .to(end, 10)
        //   .easing(TWEEN.Easing.Sinusoidal.InOut)
        //   .onUpdate(function() {
        //     console.log(start)
        //     // dom.style.setProperty('webkitTransform', `translate3d(${start.left}px, ${start.top}px, 0px) scale(${start.scale})`)
        //     // dom.style.setProperty('msTransform', `translate3d(${start.left}px, ${start.top}px, 0px) scale(${start.scale})`)

        //     el.style['webkitTransform'] = `translate3d(${start.left}px, ${start.top}px, 0px) scale(${start.scale})`
        //     el.style['msTransform'] = `translate3d(${start.left}px, ${start.top}px, 0px) scale(${start.scale})`
        //   })
        //   .onStop(function() {
        //     console.log('end')
        //   })
        //   .onComplete(function() {
        //     console.log('com')
        //     _cancelAnimationFrame(animationSwitch)
        //     return resolve()
        //   })
        //   .start() // Start the tween immediately.

        /* second situation */
        // let animationSwitch
        // const scale = from.scale
        // const left1 = from.left
        // const top1 = from.top
        // const left2 = to.left
        // const top2 = to.top
        // const d1 = left2 - left1
        // const d2 = top2 - top1
        // const step = Math.abs(d2) > Math.abs(d1) ? Math.abs(d2) : Math.abs(d1)
        // // const bool = step === 0 ? 0 : ~~step.toString().replace(/(-?).*/, '$11')
        // let i = 0

        // const _next = () => {
        //   if (++i < step) {
        //     const left = i * d1 / step + left1
        //     const top = i * d2 / step + top1
        //     // dom.style.setProperty('webkitTransform', `translate3d(${left}px, ${top}px, 0px) scale(${scale})`)
        //     // dom.style.setProperty('msTransform', `translate3d(${left}px, ${top}px, 0px) scale(${scale})`)
        //     console.log(left, top)

        //     dom.style['webkitTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        //     dom.style['msTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        //     animationSwitch = _requestAnimationFrame(_next)
        //   } else {
        //     console.log('end')
        //     _cancelAnimationFrame(animationSwitch)
        //     return resolve()
        //   }
        // }
        // animationSwitch = _requestAnimationFrame(_next)

        /* third situation */
        const { left, top, scale } = to
        dom.style['webkitTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        dom.style['msTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        return resolve()
      })
    })

    let x_mousedown
    let y_mousedown
    let x_mouseup
    let y_mouseup
    let x_startPoint
    let y_startPoint
    let x_currentPoint
    let y_currentPoint
    let zoom_startPoint
    let move_direction
    let moveFlag = false
    const handleMousedown = (event) => {
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

        /**
         * !have a bug, sometime left, top and scale is undefined
         */
        // when make the mouse down, calculate the distance between current Dom and visual window
        const { left = 0, top = 0, scale = 1 } = parseMatrix(matchedMatrix(getCSSStyle(el, 'transform')))
        x_startPoint = x_currentPoint = left
        y_startPoint = y_currentPoint = top
        zoom_startPoint = scale
      }
    }
    const handleMousemove = (event) => {
      const e = event || window.event
      // const evtTarget = e.target || e.srcElement
      if (moveFlag) {
        // if (evtTarget.mousemoveTimeout) {
        //   return false
        // }
        // evtTarget.mousemoveTimeout = setTimeout(() => {
        //   evtTarget.mousemoveTimeout = null
        // }, 10)

        if (!el.classList.contains('fangbox-moving')) {
          el.classList.add('fangbox-moving')
        }

        const f = e.screenX
        const d = e.screenY
        const h = f - x_mousedown
        const g = d - y_mousedown

        const left = +x_startPoint + h
        const top = +y_startPoint + g
        const scale = zoom_startPoint

        /** 尝试解决补间动画的问题，但是效果不理想，可能理解不对 */
        animate({ left: x_currentPoint, top: y_currentPoint, scale }, { left, top, scale }, el)
          .then(() => {
            x_currentPoint = left
            y_currentPoint = top
          })
        // el.style['webkitTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        // el.style['msTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`

        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
        return false
      }
    }
    const handleMouseup = (event) => {
      const e = event || window.event

      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }

      if (e.button === 0) {
        el.classList.remove('fangbox-moving')

        x_mouseup = e.screenX
        y_mouseup = e.screenY
        move_direction = calculateDirection(x_mousedown, y_mousedown, x_mouseup, y_mouseup)
        const position = calculateAdjustingRangs(move_direction)

        if (position) {
          const left = position._left
          const top = position._top
          const scale = position.scale
          el.style['webkitTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
          el.style['msTransform'] = `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        }

        moveFlag = false
      }
    }
    const handleMousewheel = (event) => {
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
    }

    addEvent(el, 'mousedown.fancybox', handleMousedown, false)
    // el.addEventListener('mousedown', handleMousedown, false)
    addEvent(document, 'mousemove.fancybox', handleMousemove, false)
    // document.addEventListener('mousemove', handleMousemove, false)
    addEvent(document, 'mouseup.fancybox', handleMouseup, false)
    // document.addEventListener('mouseup', handleMouseup, false)
    addEvent(el, 'mousewheel.fancybox', handleMousewheel, false)
  },
  unbind(el) {
    removeEvent(el, 'mousedown.fancybox')
    removeEvent(document, 'mousemove.fancybox')
    removeEvent(document, 'mouseup.fancybox')
    removeEvent(el, 'mousewheel.fancybox')
  }
}
