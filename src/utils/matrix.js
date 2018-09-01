/**
 * zrender: 3x2矩阵操作类
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * author: lang(shenyi01@baidu.com)
 * code from mat2d in http://glmatrix.net/
 */

(function(global) {
  function factory() {
    var matrix = {
      create: function() {
        /**
				 * [a c e]
				 * [b d f]
				 * [0 0 1]
				 */
        return [1, 0,
          0, 1,
          0, 0]
      },
      identity: function(out) {
        out[0] = 1
        out[1] = 0
        out[2] = 0
        out[3] = 1
        out[4] = 0
        out[5] = 0
      },
      // 矩阵相乘
      // 矩阵C的行数等于矩阵A的行数，C的列数等于B的列数。
      // 乘积C的第m行第n列的元素等于矩阵A的第m行的元素与矩阵B的第n列对应元素乘积之和。
      mul: function(out, m1, m2) {
        out[0] = m1[0] * m2[0] + m1[2] * m2[1]
        out[1] = m1[1] * m2[0] + m1[3] * m2[1]
        out[2] = m1[0] * m2[2] + m1[2] * m2[3]
        out[3] = m1[1] * m2[2] + m1[3] * m2[3]
        out[4] = m1[0] * m2[4] + m1[2] * m2[5] + m1[4]
        out[5] = m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
        return out
      },
      /**
			 * [1  0  v[0]] [aa ac atx]
			 * [0  1  v[1]] [ab ad aty]
			 * [0  0    1 ] [0   0   1]
			 * @param {Object} out
			 * @param {Object} a
			 * @param {Object} v
			 */
      translate: function(out, a, v) {
        out[0] = a[0]
        out[1] = a[1]
        out[2] = a[2]
        out[3] = a[3]
        out[4] = a[4] + v[0]
        out[5] = a[5] + v[1]
        return out
      },
      getTranslate: function(out, v) {
        out[0] = 1
        out[1] = 0
        out[2] = 0
        out[3] = 1
        out[4] = v[0]
        out[5] = v[1]
        return out
      },
      /**
			 * [ct  st 0] [aa ac atx]
			 * [-st ct 0] [ab ad aty]
			 * [0   0  1] [0   0   1]
			 * @param {Object} out
			 * @param {Object} a
			 * @param {Object} rad
			 */
      rotate: function(out, a, rad) {
        const aa = a[0]
        const ac = a[2]
        const atx = a[4]
        const ab = a[1]
        const ad = a[3]
        const aty = a[5]
        const st = Math.sin(rad)
        const ct = Math.cos(rad)

        out[0] = aa * ct + ab * st
        out[1] = -aa * st + ab * ct
        out[2] = ac * ct + ad * st
        out[3] = -ac * st + ct * ad
        out[4] = ct * atx + st * aty
        out[5] = ct * aty - st * atx
        return out
      },
      getRotate: function(out, rad) {
        const st = Math.sin(rad)
        const ct = Math.cos(rad)
        out[0] = ct
        out[1] = -st
        out[2] = st
        out[3] = ct
        out[4] = 0
        out[5] = 1

        return out
      },
      /**
			 * [vx 0 0] [a c e]
			 * [0 vy 0]	[b d f]
			 * [0  0 1]	[0 0 1]
			 * @param {Object} out
			 * @param {Object} a
			 * @param {Object} v
			 */
      scale: function(out, a, v) {
        const vx = v[0]
        const vy = v[1]
        out[0] = a[0] * vx
        out[1] = a[1] * vy
        out[2] = a[2] * vx
        out[3] = a[3] * vy
        out[4] = a[4] * vx
        out[5] = a[5] * vy
        return out
      },

      getScale: function(out, v) {
        const vx = v[0]
        const vy = v[1]
        out[0] = vx
        out[1] = 0
        out[2] = 0
        out[3] = vy
        out[4] = 0
        out[5] = 0
        return out
      },
      /**
			 * 求逆矩阵
			 */
      invert: function(out, a) {
        const aa = a[0]
        const ac = a[2]
        const atx = a[4]
        const ab = a[1]
        const ad = a[3]
        const aty = a[5]

        var det = aa * ad - ab * ac
        if (!det) {
          return null
        }
        det = 1.0 / det

        out[0] = ad * det
        out[1] = -ab * det
        out[2] = -ac * det
        out[3] = aa * det
        out[4] = (ac * aty - ad * atx) * det
        out[5] = (ab * atx - aa * aty) * det
        return out
      },
      /**
			 * 矩阵左乘向量
			 * xo = ax + cy + e
			 * yo = bx + dy + f
			 */
      mulVector: function(out, a, v) {
        const aa = a[0]
        const ac = a[2]
        const atx = a[4]
        const ab = a[1]
        const ad = a[3]
        const aty = a[5]

        out[0] = v[0] * aa + v[1] * ac + atx
        out[1] = v[0] * ab + v[1] * ad + aty

        return out
      }
    }

    return matrix
  }

  if (typeof module !== 'undefined' && typeof exports === 'object') {
    // 能够满足Node.js的需求
    module.exports = factory()
  } else if (typeof global.define === 'function' && (global.define.cmd || global.define.amd)) {
    // 当没有上述全局变量，且有define全局变量时，我们认为是AMD或CMD，可以直接将factory传入define
    // 注意：CMD其实也支持return返回模块接口，所以两者可以通用
    global.define(factory)
  } else {
    // 最后是script标签全局引入
    // 我们可以将模块放在window上为了模块内部在浏览器和Node.js中都能使用全局对象，我们可以做此判断
    global.matrix = factory()
  }
})(typeof window !== 'undefined' ? window : global)
