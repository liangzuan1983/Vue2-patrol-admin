<template>
  <div class="map-container" ref="container">
    <baidu-map class="bm-view" :scroll-wheel-zoom="scrollWheelZoom" :center="center" :zoom="zoom" :ak="APP_KEY" @ready="handlerMap">
    </baidu-map>
  </div>
</template>

<script>
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmView from 'vue-baidu-map/components/map/MapView.vue'
const APP_KEY = 'CdheGAoG7cgw72buOCzctrBoyuGtf7u7'
export default {
  name: 'alarmMap',
  components: {
    BaiduMap,
    BmView
  },
  data() {
    return {
      APP_KEY,
      center: {
        lng: 113.462954,
        lat: 23.181357
      },
      zoom: 15,
      scrollWheelZoom: true
    }
  },
  mounted() {},
  methods: {
    handlerMap({ BMap, map }) {
      /**
       * some problems with the plugin "vue-baidu-map"
       * 1. init map with asynvchronous, so if you wanna make centerAndZoom, make it here or set data with components ':center', but cannot used together!!!
       * 2. some view`s error with the component of bm-view, maybe the layout of flex
       * 3. set nocache for current component inside the router.js
       */
      const { center } = this
      const centerPoint = new BMap.Point(center.lng, center.lat)
      // map.centerAndZoom(centerPoint, zoom)
      // map.panTo(centerPoint)
      map.addOverlay(new BMap.Marker(centerPoint))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 25px;
  .bm-view {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 15px 2px #a3b3b0;
  }
}
</style>