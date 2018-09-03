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
      if (window.document.currentStyle) {
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

    let x_mousedown
    let y_mousedown
    let x_mouseup
    let y_mouseup
    let x_startPoint
    let y_startPoint
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
        // when make the mouse down, calculate the distance between current Dom and visual window
        const { left, top, scale } = parseMatrix(matchedMatrix(getCSSStyle(el, 'transform')))
        x_startPoint = left
        y_startPoint = top
        zoom_startPoint = scale
      }
    }
    const handleMousemove = (event) => {
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
    addEvent(el, 'mousedown.fancybox', handleMousedown, false)
    // el.addEventListener('mousedown', handleMousedown, false)
    addEvent(document, 'mousemove.fancybox', handleMousemove, false)
    // document.addEventListener('mousemove', handleMousemove, false)
    addEvent(document, 'mouseup.fancybox', handleMouseup, false)
    // document.addEventListener('mouseup', handleMouseup, false)
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
    addEvent(el, 'mousewheel.fancybox', handleMousewheel, false)
  },
  unbind(el) {
    removeEvent(el, 'mousedown.fancybox')
    removeEvent(document, 'mousemove.fancybox')
    removeEvent(document, 'mouseup.fancybox')
    removeEvent(el, 'mousewheel.fancybox')
  }
}
