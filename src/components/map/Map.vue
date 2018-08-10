<template>
<div>
  <div v-if="!hasBmView" ref="view" style="width: 100%; height: 100%"></div>
</div>
</template>

<script>
export default {
  name: 'bm-map',
  props: {
    ak: {
      type: String
    },
    center: {
      type: [Object, String]
    },
    zoom: {
      type: Number
    },
    minZoom: {
      type: Number
    },
    maxZoom: {
      type: Number
    },
    highResolution: {
      type: Boolean,
      default: false
    },
    mapClick: {
      type: Boolean,
      default: true
    },
    mapType: {
      type: String
    },
    dragging: {
      type: Boolean,
      default: true
    },
    scrollWheelZoom: {
      type: Boolean,
      default: false
    },
    doubleClickZoom: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    inertialDragging: {
      type: Boolean,
      default: true
    },
    continuousZoom: {
      type: Boolean,
      default: true
    },
    pinchToZoom: {
      type: Boolean,
      default: true
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    theme: {
      type: Array
    },
    mapStyle: {
      type: Object
    }
  },
  watch: {
    center(val, oldVal) {
      const { BMap, map, zoom, checkType } = this
      if (checkType(val) === 'String' && val !== oldVal) {
        map.centerAndZoom(val, zoom)
      } else {
        map.centerAndZoom(new BMap.Point(val.lng, val.lat), zoom)
      }
    },
    'center.lng'(val, oldVal) {
      const { BMap, map, zoom, center } = this
      if (val !== oldVal && val >= -180 && val <= 180) {
        map.centerAndZoom(new BMap.Point(val, center.lat), zoom)
      }
    },
    'center.lat'(val, oldVal) {
      const { BMap, map, zoom, center } = this
      if (val !== oldVal && val >= -74 && val <= 74) {
        map.centerAndZoom(new BMap.Point(center.lng, val), zoom)
      }
    },
    zoom(val, oldVal) {
      const { map } = this
      if (val !== oldVal && val >= 3 && val <= 19) {
        map.setZoom(val)
      }
    }
  },
  data() {
    return {
      hasBmView: false
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      const { getMapScript, initMap } = this
      getMapScript()
        .then(initMap)
    },
    initMap(BMap) {
      this.BMap = BMap
      this.init(BMap)
    },
    getMapScript() {
      if (!global.BMap) {
        const ak = this.ak || this._BMap().ak
        global.BMap = {}
        global.BMap._preloader = new Promise((resolve, reject) => {
          global._initBaiduMap = function() {
            resolve(global.BMap)
            global.document.body.removeChild($script)
            global.BMap._preloader = null
            global._initBaiduMap = null
          }
          const $script = document.createElement('script')
          global.document.body.appendChild($script)
          $script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=_initBaiduMap`
        })
        return global.BMap._preloader
      } else if (!global.BMap._preloader) {
        return Promise.resolve(global.BMap)
      } else {
        return global.BMap._preloader
      }
    },
    init(BMap) {
      if (this.map) {
        return
      }
      let $el = this.$refs.view
      for (const $node of this.$slots.default || []) {
        if ($node.componentOptions && $node.componentOptions.tag === 'bm-view') {
          this.hasBmView = true
          $el = $node.elm
        }
      }
      const map = new BMap.Map($el)
      this.map = map
      const { getCenterPoint, zoom } = this
      // 此处强行初始化一次地图 回避一个由于错误的 center 字符串导致初始化失败抛出的错误
      map.reset()
      map.centerAndZoom(getCenterPoint(), zoom)
      this.$emit('ready', { BMap, map })
    },
    getCenterPoint() {
      const { center, BMap, checkType } = this
      switch (checkType(center)) {
        case 'String': return center
        case 'Object': return new BMap.Point(center.lng, center.lat)
        default: return new BMap.Point()
      }
    },
    checkType: val => Object.prototype.toString.call(val).slice(8, -1)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>