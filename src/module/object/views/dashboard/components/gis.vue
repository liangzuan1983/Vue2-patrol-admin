<template>
  <div class="GIS">
    <div class="app-component__head">
      <span class="title">GIS地图</span>
    </div>
    <div v-loading="isLoaded" class="app-component__body">
      <baidu-map class="bm-view" 
        :scroll-wheel-zoom="scrollWheelZoom" 
        :center="BMCenter" 
        :zoom="BMZoom" 
        :ak="APP_KEY" 
        @ready="mapReady">
        <bm-marker v-for="item in robotList" 
          :key="item.id"
          :zIndex="1"
          :icon="robotIcon"
          :position="{lng: item.longitude, lat: item.latitude}">
        </bm-marker>
      </baidu-map>
    </div>
  </div>
</template>

<script>
import { findRobotStatusList } from '@object/api/dashboard'

import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'

import robotIcon from '@/assets/images/native/robot_online.png' // 机器人在线图标

export default {
  name: 'GIS',
  data() {
    return {
      isLoaded: true,
      APP_KEY: 'CdheGAoG7cgw72buOCzctrBoyuGtf7u7', // 百度API调用的KEY
      scrollWheelZoom: true, // 允许滚动
      BMZoom: 8, // 百度地图的缩放比例
      robotIcon: {
        url: robotIcon,
        size: { width: 24, height: 24 },
        opts: {
          imageSize: { width: 24, height: 24 }
        }
      }, // 图标的加载
      BMCenter: {
        lng: 113.462954,
        lat: 23.181357
      }, // 加载的中心点
      robotList: [], // 机器人状态数据（原数据）
      interval: null
    }
  },
  created() {
    this.fetchSourceData()
    this.$nextTick(() => {
      this.fetchDataByInterval()
    })
  },
  mounted() {},
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval)
  },
  components: {
    BaiduMap,
    BmMarker
  },
  methods: {
    fetchSourceData() {
      findRobotStatusList().then(response => {
        if (!Array.isArray(response.data)) return
        this.robotList = response.data
      })
    },
    fetchDataByInterval() {
      if (this.interval) {
        clearInterval(this.interval)
      }
      this.interval = setInterval(this.fetchSourceData, 4000)
    },
    mapReady({ BMap, map }) {
      /**
       * some problems with the plugin 'vue-baidu-map'
       * 1. init map with asynvchronous, so if you wanna make centerAndZoom, make it here or set data with components ':center', but cannot used together!!!
       * 2. some view`s error with the component of bm-view, maybe the layout of flex
       * 3. set nocache for current component inside the router.js
       */
      this.$map = map
      this.$BMap = BMap
      setTimeout(() => {
        this.isLoaded = false
      }, 1000)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 遵循BEM的命名方式
.block{}
.block__element{}
.block--modifier{} */
.GIS {
  position: relative;
  width: 100%;
  margin-bottom: 0px !important;
  .app-component__body {
    width: 100%;
    flex: 1;
  }
  .bm-view {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 15px 2px #a3b3b0;
  }
}
</style>