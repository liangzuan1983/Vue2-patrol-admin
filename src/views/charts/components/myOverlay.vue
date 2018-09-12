<template>
  <bm-overlay
    class="bm-overlay-self"
    ref="customOverlay"
    :pane="MapPane"
    @click.native="handleClick($event)"
    @draw="draw">
    <slot></slot>
  </bm-overlay>
</template>

<script>
import BmOverlay from 'vue-baidu-map/components/overlays/overlay.vue'
export default {
  name: 'MyOverlay',
  props: {
    // http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a3b1
    MapPane: {
      type: String,
      default: 'floatPane'
    },
    position: {
      required: true,
      type: Object,
      default: {
        lng: 0,
        lat: 0
      }
    },
    width: {
      required: true,
      type: Number,
      default: 24
    },
    height: {
      required: true,
      type: Number,
      default: 24
    }
  },
  data() {
    return {
      iconWidth: this.width,
      iconHeight: this.height
    }
  },
  components: {
    BmOverlay
  },
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - this.iconWidth / 2 + 'px'
      el.style.top = pixel.y - this.iconHeight / 2 + 'px'
    },
    handleClick(event) {
      /* highlight the currentTarget */
      if (this.$refs.customOverlay.map) {
        const floatPanes = Array.from(this.$refs.customOverlay.map.getPanes()[this.MapPane].children)
        for (const item of floatPanes) {
          if (item.classList.contains('highlight')) {
            item.classList.remove('highlight')
          }
        }
        const target = event.currentTarget
        target.classList.add('highlight')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.bm-overlay-self {
  overflow: hidden;
  box-shadow: 0 0 5px #c3c3c3;
  text-align: center;
  border-radius: 50%;
  padding: 5px;
  position: absolute;
  cursor: pointer;
  &.highlight {
    z-index: 999;
    box-shadow: 0 0 7px 3px #38e2d2;
  }
}
</style>