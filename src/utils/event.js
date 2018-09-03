/**
 * imitate the event binding of JQuery
 */
function now() {
  return +new Date()
}
// var win = this
const expando = 'gosunyun' + now()
let uuid = 0
const cache = {}

const data = function(elem, name, data) {
  var id = elem[expando]
  if (!id) { id = elem[expando] = ++uuid }
  if (name && !cache[id]) { cache[id] = {} }
  if (data !== undefined) { cache[id][name] = data }
  return name
    ? cache[id][name]
    : id
}

const removeData = function(elem, name) {
  var id = elem[expando]
  if (name) {
    if (cache[id]) {
      delete cache[id][name]
      name = ''
      for (name in cache[id]) { break }
      if (!name) { removeData(elem) }
    }
  } else {
    try {
      delete elem[expando]
    } catch (e) {
      if (elem.removeAttribute) { elem.removeAttribute(expando) }
    }
    delete cache[id]
  }
}

const myEach = function(object, callback, args) {
  let name
  let i = 0
  const length = object.length
  if (args) {
    if (length === undefined) {
      for (name in object) {
        if (callback.apply(object[name], args) === false) { break }
      }
    } else {
      for (; i < length;) {
        if (callback.apply(object[i++], args) === false) { break }
      }
    }
  } else {
    if (length === undefined) {
      for (name in object) {
        if (callback.call(object[name], name, object[name]) === false) { break }
      }
    } else {
      for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) { return true }
    }
  }
  return object
}

const gevent = {
  guid: 1,
  /**
     * handler 是用户自定义的事件
     * handle  各种行为触发后会执行的函数
     * handlers 缓存事件数据中的对应事件列表
     *
     * @param {Object} elem
     * @param {Object} types
     * @param {Object} handler
     */
  add: function(elem, types, handler) {
    if (elem.nodeType === 3 || elem.nodeType === 8) { return }
    if (typeof data !== 'function') {
      return
    }
    if (elem.setInterval && elem !== window) { elem = window }
    // 给函数一个唯一标识的索引  方便后面删除该事件
    if (!handler.guid) { handler.guid = this.guid++ }
    // 获得该元素的events handle 下的数据
    const events = data(elem, 'events') || data(elem, 'events', {})
    const handle = data(elem, 'handle') || data(elem, 'handle', function() {
      // gevent.handle才是各种行为触发后会执行的函数
      /* eslint-disable no-caller */
      gevent.handle.apply(arguments.callee.elem, arguments)
    })

    handle.elem = elem
    // 遍历事件名 因为可以是 click mouseover
    myEach(types.split(/\s+/), function(index, type) {
      // 事件名字有可能是 click.d
      var namespaces = type.split('.')
      // 获得事件名
      type = namespaces.shift()
      if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
        type = 'DOMMouseScroll'
      }
      // 去掉点后面的东西 是个特殊的命名  在删除的时候可以指定删除他  如 click.d
      // 用事件的type 记录住这个特殊的命名
      handler.type = namespaces.slice().sort().join('.')
      // 获得该事件是否已经存在events 这个对象里面了
      var handlers = events[type]
      // 如果不存在该事件 给元素绑定该事件
      if (!handlers) {
        handlers = events[type] = {}
        if (elem.addEventListener) { elem.addEventListener(type, handle, false) } else if (elem.attachEvent) { elem.attachEvent('on' + type, handle) }
      }
      // 吧函数放到元素的该事件的列表里面
      handlers[handler.guid] = handler
    })
    elem = null
  },
  remove: function(elem, types, handler) {
    if (elem.nodeType === 3 || elem.nodeType === 8) { return }
    // 获取这个元素的所有行为列表  如 {click:{},mouseocer:{}}
    if (typeof data !== 'function') {
      return
    }
    const events = data(elem, 'events')
    let ret
    if (events) {
      // 如果没出入行为类型 则删除这个元素的所有事件
      // 如果传入的是.xx这种形式的 把所有行为的包含.xx命名的全部干掉
      if (types === undefined || (typeof types === 'string' && types.charAt(0) === '.')) {
        for (var type in events) { this.remove(elem, type + (types || '')) }
      } else {
        // 处理  {types: xx, handler: xxx} 这种情况
        if (types.type) {
          handler = types.handler
          types = types.type
        }
        // 因为删除事件可以一次支持删除多个 如click mouseover  所有要遍历删除
        myEach(types.split(/\s+/), function(index, type) {
          var namespaces = type.split('.')
          type = namespaces.shift()
          if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
            type = 'DOMMouseScroll'
          }
          var namespace = RegExp('(^|\\.)' + namespaces.slice().sort().join('.*\\.') + '(\\.|$)')
          if (events[type]) {
            // 如果传了第3个参数 函数  则删除这个事件
            if (handler) { delete events[type][handler.guid] } else {
              // 遍历中个这个的所有行为
              for (var handle in events[type]) {
                // Handle the removal of namespaced events
                // 删除有特殊命名的函数
                // 如果没有特殊命名 正则 则是 /(^|\.)(\.|$)/ 可以匹配空 所以也能删除掉没有特殊命名的函数
                // 个人觉得这句话，貌似没用，反正都要删除，有与没有 有差别吗
                if (namespace.test(events[type][handle].type)) { delete events[type][handle] }
              }
            }
          }

          // 暂时无法理解 这个ret有什么用处
          for (ret in events[type]) break
          // 如果events[type]变成空的了 也就是{} 删除这个元素的的绑定事件
          if (!ret) {
            if (elem.removeEventListener) { elem.removeEventListener(type, data(elem, 'handle'), false) } else if (elem.detachEvent) { elem.detachEvent('on' + type, data(elem, 'handle')) }
            ret = null
            delete events[type]
          }
        })
      }
      for (ret in events) break
      // 如果发现元素的整个events都是空的了
      // 清空掉handle 并且清空掉他所有的引用
      if (!ret) {
        var handle = data(elem, 'handle')
        if (handle) handle.elem = null
        removeData(elem, 'events')
        removeData(elem, 'handle')
      }
    }
  },

  handle: function(event) {
    var all, handlers
    // 包装event
    event = arguments[0] = gevent.fix(event || window.event)
    event.currentTarget = this
    // 这里的........
    var namespaces = event.type.split('.')
    event.type = namespaces.shift()
    all = !namespaces.length
    var namespace = RegExp('(^|\\.)' + namespaces.slice().sort().join('.*\\.') + '(\\.|$)')
    // 取这个元素的该行为 的 事件列表
    if (typeof data === 'function') {
      handlers = (data(this, 'events') || {})[event.type]
      // 遍历这个事件列表 执行该执行的东西
      for (var j in handlers) {
        var handler = handlers[j]
        if (all || namespace.test(handler.type)) {
          // Pass in a reference to the handler function itself
          // So that we can later remove it
          // jq上的注释是是这么写的 把event的handler 引用这个事件 方便之后移除
          // 但是在remove里面 并没有用到event的handler  不知道这里到底有什么用  且有多个事件的时候这个事件被取代
          event.handler = handler
          // 执行事件 并且是用元素调用的事件 可以吧事件里面的this执行元素 ret为函数的返回值
          var ret = handler.apply(this, arguments)
          // 如果有返回值  且返回值是false 执行阻止事件冒泡 阻止执行事件默认行为
          if (ret !== undefined) {
            event.result = ret
            if (ret === false) {
              event.preventDefault()
              event.stopPropagation()
            }
          }
        }
      }
    }
  },
  props: 'altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which'.split(' '),
  fix: function(event) {
    // new setEvent会给event给以个expando属性 如果有中个属性 说明已经生成了event了 不需要在次对event进行包装
    if (event[expando]) { return event }
    // 保留一个原始的event
    // new一个新的event 这个与原始的event是不同的
    var originalEvent = event
    event = new SetEvent(originalEvent)

    /**
     * 主要是对做一个原生event的一个copy  然后把不兼容的方法  都合成兼容的写法
     */

    // 获得原始event的属性值  有哪些属性值 见 this.props
    for (var i = this.props.length, prop; i;) {
      prop = this.props[--i]
      event[prop] = originalEvent[prop]
    }
    // 将目标元素同一成event.target
    if (!event.target) { event.target = event.srcElement || document } // Fixes #1925 where srcElement might not be defined either
    // 如果发现是文本节点 取他的父节点
    if (event.target.nodeType === 3) { event.target = event.target.parentNode }
    if (!event.relatedTarget && event.fromElement) { event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement }
    return event
  }
}

const SetEvent = function(src) {
  // Allow instantiation without the 'new' keyword
  // Event object
  if (src && src.type) {
    this.originalEvent = src
    this.type = src.type
    // Event type
  } else { this.type = src }
  // timeStamp is buggy for some events on Firefox(#3843)
  // So we won't rely on the native value
  this.timeStamp = now()
  // Mark it as fixed
  this[expando] = true
}

function returnFalse() {
  return false
}

function returnTrue() {
  return true
}

SetEvent.prototype = {
  preventDefault: function() {
    var e = this.originalEvent
    if (!e) { return }
    // if preventDefault exists run it on the original event
    if (e.preventDefault) { e.preventDefault() }
    // otherwise set the returnValue property of the original event to false (IE)
    e.returnValue = false
  },
  stopPropagation: function() {
    var e = this.originalEvent
    if (!e) { return }
    // if stopPropagation exists run it on the original event
    if (e.stopPropagation) { e.stopPropagation() }
    // otherwise set the cancelBubble property of the original event to true (IE)
    e.cancelBubble = true
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue
    this.stopPropagation()
  },
  isImmediatePropagationStopped: returnFalse
}

exports.addEvent = (el, type, fn, capture) => {
  if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
    type = 'DOMMouseScroll'
  }
  gevent.add(el, type, fn)
}

exports.removeEvent = (el, type, fn, capture) => {
  if (type === 'mousewheel' && document.mozFullScreen !== undefined) {
    type = 'DOMMouseScroll'
  }
  gevent.remove(el, type)
}
