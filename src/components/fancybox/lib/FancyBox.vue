<template>
  <transition name="fancyboxShade" v-on:after-leave="shadeAfterLeave" v-on:after-enter="fadeAfterEnter">
    <v-touch class="fancybox-mask" tag="div" v-show="visible" v-on:tap="handleTapClosed">
      <div ref="fancyBoxWrapper" class="fancybox-wrapper">
        <transition name="fade" mode="out-in">
          <div v-if="loadingPic" key="loading" class="fancybox__loading_spinner">
            <!-- <svg-icon icon-class="loading"></svg-icon> -->
            <svg class="fancybox__loading" viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg>
          </div>
          <div v-else key="fancyboxImage">  
            <div>
              <img class="fancybox__img" :style="fixStyle" :src="activeUrl">  
            </div>
          </div>
        </transition>
      </div>
    </v-touch>
  </transition>
</template>

<script>
import Vue from 'vue'
import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })

export default {
  name: 'fancy-box-main',
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
      options: {
        fixWidth: 0,
        fixlHeight: 0
      }
    }
  },
  methods: {
    initDom() {
      this.initEvent()
    },
    initEvent() {

    },
    handleTapClosed() {
      this.destroy()
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
    div {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      .fancybox__img {
        transform-origin: left top 0px;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.22, 1);
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