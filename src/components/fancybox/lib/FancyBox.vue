<template>
  <transition name="fancyboxShade" v-on:after-leave="shadeAfterLeave" v-on:after-enter="fadeAfterEnter">
    <div class="fancybox-mask" v-show="visible" v-on:click="handleTapClosed">
      <div ref="fancyBoxWrapper" class="fancybox-wrapper">
        <transition name="fade" mode="out-in">
          <div v-if="loadingPic" key="loading" class="fancybox__loading_spinner">
            <!-- <svg-icon icon-class="loading"></svg-icon> -->
            <svg class="fancybox__loading" viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
          </div>
          <div v-else key="fancyboxImage">  
            <div>
              <img class="fancybox__img" :style="fixStyle" :src="activeUrl"
              v-fancybox-drag
              :width="width"
              :height="height"
              draggable="true"
              v-on:DOMMouseScroll.stop.prevent="handleMousewheel($event)"
              v-on:mousewheel.stop.prevent="handleMousewheel($event)"
              >
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
import fancyboxDrag from '@/directive/fancybox-drag'
export default {
  name: 'fancy-box-main',
  directives: { fancyboxDrag },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      thumbnails: [],
      activeStyle: {},
      enterAndLeaveStyle: {},
      imageIsActive: false,
      activeUrl: '',
      activeImageStyle: {},
      loadingPic: true,
      ImgBase64: null,
      width: null,
      height: null,
      timestamp: null,
      zoomRatio: 0.6, // 缩放速率
      position: {
        top: 0,
        left: 0,
        scale: 1
      }
    }
  },
  methods: {
    initDom() {
      this.initEvent()
    },
    initEvent() {},
    handleTapClosed(event) {
      const evtTarget = event.target || event.srcElement
      if (evtTarget.nodeName === 'IMG') {
        return
      }
      this.destroy()
    },
    handleMousewheel(event) {
      const evtTarget = event.target || event.srcElement
      if (evtTarget.wheelTimeout) {
        clearTimeout(evtTarget.wheelTimeout)
      }
      evtTarget.wheelTimeout = setTimeout(() => {
        const TYPE = event.type
        let delta
        if (TYPE === 'DOMMouseScroll' || TYPE === 'wheel' || TYPE === 'mousewheel') {
          delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3
        }
        const bool = delta === 0 ? 0 : ~~delta.toString().replace(/(-?).*/, '$11')
        this.position = this.zoomAtPoint({
          upOrDown: bool,
          eventX: event.offsetX,
          eventY: event.offsetY,
          zoomRatio: this.zoomRatio,
          ...this.position
        })
      }, 120)
    },
    handleMouseDown(event) {
      console.info(event)
    },
    handleMouseMove(event) {
      console.info(event)
    },
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
    zoomAtPoint({ left, top, scale, upOrDown, eventX, eventY, zoomRatio }) {
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
    },
    destroy() {
      if (!this.visible) return
      this.visible = false
      this.imageIsActive = false
    },
    shadeAfterLeave() {
      this.$nextTick().then(() => {
        this.$refs.fancyBoxWrapper && document.body.removeChild(this.$refs.fancyBoxWrapper.parentNode)
        this.$destroy.bind(this)
      })
    },
    fadeAfterEnter() {
      this.imageIsActive = true
    },
    getElWidth(el) {
      return el.getBoundingClientRect().width
    },
    // 缩略图放大的倍数
    getZoomTransform(el) {
      return (
        this.getElWidth(el) /
        this.options.width /
        this.options.fitRatio
      )
    },
    getCenter(fixRatio) {
      const { width, height } = this.options
      var { fitRatio } = this.options
      if (typeof fixRatio !== 'undefined') {
        fitRatio *= +fixRatio
      }
      return {
        // 居中 左边距
        x: Math.round(
          (window.innerWidth - width * fitRatio) / 2
        ),
        // 居中 顶边距
        y: Math.round(
          (window.innerHeight - height * fitRatio) / 2
        ),
        // 自适应后的 width
        w: Math.round(width * fitRatio),
        h: Math.round(height * fitRatio)
      }
    },
    isEmptyObject(a) {
      for (const b in a) {
        return !1
      }
      return !0
    }
  },
  computed: {
    fixStyle() {
      return this.imageIsActive ? this.activeStyle : this.enterAndLeaveStyle
    }
  },
  watch: {
    position: {
      handler(val, oldVal) {
        const { left, top, scale } = val
        this.activeStyle = {
          webkitTransform: `translate3d(${left}px, ${top}px, 0px) scale(${scale})`,
          msTransform: `translate3d(${left}px, ${top}px, 0px) scale(${scale})`
        }
      },
      deep: false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$svgWidth: 42px;
$svgHeight: 42px;

.fancybox-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgba(7,17,27, .8);
  z-index: 2002;
  .fancybox-wrapper {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    user-select: none;
    div {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      user-select: none;
      .fancybox__img {
        transform-origin: left top 0px;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.22, 1);
        user-select: none;
        cursor: -webkit-grab;
      }
    }
    .fancybox__loading_spinner {
      top: 50%;
      margin-top: -($svgHeight / 2);
      height: auto;
      text-align: center;
      position: absolute;
      .fancybox__loading {
        height: $svgHeight;
        width: $svgWidth;
        animation: loading-rotate 2s linear infinite;
        & > .path {
          animation: loading-dash 1.5s ease-in-out infinite;
          stroke-dasharray: 90,150;
          stroke-dashoffset: 0;
          stroke-width: 2;
          stroke: #409eff;
          stroke-linecap: round;
        }
      }
    }
  }
}

</style>