<template>
  <el-container class="map-container" ref="container" v-loading="maploading">
    <baidu-map class="bm-view" :scroll-wheel-zoom="scrollWheelZoom" :center="center" :zoom="zoom" :ak="APP_KEY" @ready="handlerMap">
      <!-- 为了让自定义的信息体 与 marker 处于同一层 便于设置zIndex 所以改为markerPane容器 -->
      <my-overlay
        v-for="item in _alarmList" :key="item.id"
        class="overlay-alarm"
        MapPane="markerPane"
        :width="alarmIcon.width"
        :height="alarmIcon.height"
        :position="{lng: item.longitude, lat: item.latitude}"
        @click.native="handleAlarmClick($event, item.longitude, item.latitude)">
        <div :style="{width: alarmIcon.width + 'px', height: alarmIcon.height + 'px'}">
          <!-- <svg-icon v-if="show" v-bind:class="item.alarmLevel | alarmLevelClass" :style="{width: alarmIcon.width + 'px', height: alarmIcon.height + 'px'}" icon-class="alarm"></svg-icon> -->
          <img :src="item.alarmLevel | alarmLevelClass" alt="">
          <!-- <span>{{ item.alarmName }}</span> -->
        </div>
      </my-overlay>

       <bm-marker v-for="item in robotList" 
        :key="item.id"
        :zIndex="1"
        :icon="robotIcon"
        :position="{lng: item.longitude, lat: item.latitude}">
      </bm-marker>
    </baidu-map>
  </el-container>
</template>

<script>
import { getToken } from '@/utils/auth' // getToken from cookie

import MyOverlay from './components/myOverlay.vue'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'

import websocket from './mixin/websocket'

import robotIcon from '@/assets/images/native/robot_online.png'
import alarmLevel_1 from '@/assets/images/native/alarmLevel-1.png'
import alarmLevel_2 from '@/assets/images/native/alarmLevel-2.png'
import alarmLevel_3 from '@/assets/images/native/alarmLevel-3.png'

const APP_KEY = 'CdheGAoG7cgw72buOCzctrBoyuGtf7u7'
const ALARM_TYPE = 1 // 告警信息
const STATUS_TYPE = 2 // 机器人状态信息

export default {
  name: 'alarmMap',
  components: {
    MyOverlay,
    BaiduMap,
    BmMarker
  },
  mixins: [websocket],
  data() {
    return {
      APP_KEY,
      center: {
        lng: 113.462954,
        lat: 23.181357
      },
      robotList: [], // [{ longitude: 113.46375, latitude: 23.180965, id: 12 }],
      alarmList: [], // [{ 'linkageDistance': '', 'alarmLevel': 2, 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '29.6℃', 'Key': '告警值' }, { 'Value': '2018-08-15 14: 09: 35.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 655, 'longitude': 113.46375, 'latitude': 23.180965, 'type': 1 }, { 'linkageDistance': '', 'alarmLevel': 3, 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '29.7℃', 'Key': '告警值' }, { 'Value': '2018-08-15 14: 11: 04.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 656, 'longitude': 113.4627905, 'latitude': 23.181015, 'type': 1 }, { 'linkageDistance': '', 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '29.9℃', 'Key': '告警值' }, { 'Value': '2018-08-15 14: 13: 23.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 657, 'longitude': 113.46275, 'latitude': 23.180965, 'type': 1 }, { 'linkageDistance': '', 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '30.0℃', 'Key': '告警值' }, { 'Value': '2018-08-15 14: 14: 29.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 658, 'longitude': 113.46275, 'latitude': 23.180965, 'type': 1 }, { 'linkageDistance': '', 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '30.0℃', 'Key': '告警值' }, { 'Value': '2018-08-15 14: 15: 32.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 659, 'longitude': 113.46275, 'latitude': 23.180965, 'type': 1 }, { 'linkageDistance': '', 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '29.8℃', 'Key': '告警值' }, { 'Value': '2018-08-15 14: 17: 41.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 660, 'longitude': 113.46275, 'latitude': 23.180965, 'type': 1 }, { 'linkageDistance': '', 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '28.8℃', 'Key': '告警值' }, { 'Value': '2018-08-15 14: 59: 18.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 661, 'longitude': 113.46275, 'latitude': 23.180965, 'type': 1 }, { 'linkageDistance': '', 'title': '普通告警', 'values': [{ 'Value': '高温告警', 'Key': '告警名称' }, { 'Value': '30.1℃', 'Key': '告警值' }, { 'Value': '2018-08-15 15: 08: 52.0', 'Key': '告警时间' }, { 'Value': '', 'Key': '告警区域' }], 'address': [], 'altitude': '', 'linkage': 0, 'Id': 662, 'longitude': 113.46273, 'latitude': 23.180798, 'type': 1 }],
      robotIcon: {
        url: robotIcon,
        size: { width: 24, height: 24 },
        opts: {
          imageSize: { width: 24, height: 24 }
        }
      },
      alarmIcon: {
        width: 20,
        height: 20
      },
      zoom: 19,
      scrollWheelZoom: true,
      maploading: true,
      ws: null,
      wsMessage: null // public param
    }
  },
  filters: {
    alarmLevelClass(level = 1) {
      let url = ''
      switch (level) {
        case 1:
          url = alarmLevel_1
          break
        case 2:
          url = alarmLevel_2
          break
        default:
          url = alarmLevel_3
      }
      return url
    }
  },
  methods: {
    handlerMap({ BMap, map }) {
      /**
       * some problems with the plugin 'vue-baidu-map'
       * 1. init map with asynvchronous, so if you wanna make centerAndZoom, make it here or set data with components ':center', but cannot used together!!!
       * 2. some view`s error with the component of bm-view, maybe the layout of flex
       * 3. set nocache for current component inside the router.js
       */
      this.$map = map
      this.$BMap = BMap
      setTimeout(() => {
        this.maploading = false
      }, 1000)
    },
    handleAlarmClick(event, lng, lat) {
      if (this.$map) {
        this.panToPoint(lng, lat)
      }
      /* additional requirement for wpf */
      if (typeof window.external.videoCenter !== 'undefined') {
        window.external.videoCenter()
      }
    },
    panToPoint(lng, lat) {
      // some problem in IE when new Point with a long distance lng-lat
      this.$map.panTo(new this.$BMap.Point(lng, lat), {
        noAnimation: false
      })
    },
    centerAndZoom(lng, lat) {
      this.$map.centerAndZoom(new this.$BMap.Point(lng, lat), this.zoom)
    }
  },
  computed: {
    _alarmList() {
      return this.alarmList.map((item) => {
        const { longitude, latitude, type, id } = item
        return {
          longitude,
          latitude,
          type,
          id,
          alarmLevel: item.alarmLevel,
          alarmName: item['values'][0]['Value'],
          alarmValue: item['values'][1]['Value'],
          alarmTime: item['values'][2]['Value'],
          alarmArea: item['values'][3]['Value']
        }
      })
    }
  },
  watch: {
    wsMessage: {
      handler(val, oldValue) {
        const { flag, data } = val
        const { alarmList, robotList } = this
        if (Array.isArray(data) && data.length > 0) {
          for (const item of data) {
            console.log('type', item.type)
            if (item.type === ALARM_TYPE) {
              console.log('ALARM_TYPE', item)
              deal(alarmList, item, flag)
            } else if (item.type === STATUS_TYPE) {
              console.log('STATUS_TYPE', item)
              deal(robotList, item, flag)
            }
          }
        } else if (typeof data === 'object') {
          console.log('type', data.type)
          if (data.type === ALARM_TYPE) {
            console.log('ALARM_TYPE', data)
            deal(alarmList, data, flag)
          } else if (data.type === STATUS_TYPE) {
            console.log('STATUS_TYPE', data)
            deal(robotList, data, flag)
          }
        }

        function deal(list, obj, type) {
          const Id = obj.Id
          if (!Id) return
          var _index = list.indexOf(list.find((item) => {
            return item.Id === Id
          }))

          if (type === 'add') {
            if (_index >= 0) {
              list.splice(_index, 1, obj)
            } else {
              list ? list.push(Object.assign(obj)) : [].concat(Object.assign(obj))
            }
          } else if (type === 'delete') {
            _index >= 0 && list.splice(_index, 1)
          }
        }
      },
      deep: true
    }
  },
  /**
   * 这是满足wpf的额外需求，当wpf在url附带更新的参数，通过自定义判断，可阻止路由跳转，同时获取参数
   * 也可以通过webSocket 向后台获取，但是需要wpf连通后台，两层webSocket实在麻烦
   * 同时需要判断 cookie 下的token 是否存在
   */
  beforeRouteLeave(to, from, next) {
    var that = this
    new Promise((resolve, reject) => {
      if (to.path === '/404') {
        if (getToken()) {
          if (to.redirectedFrom) {
            const path = to.redirectedFrom
            const reg = /\!lng=(.*)&lat=(.*)&device=(\w+)$/g
            const res = reg.exec(path)
            const lng = res ? res[1] : ''
            const lat = res ? res[2] : ''
            const device = res ? res[3] : ''
            if (device === 'wpf') {
              that.centerAndZoom(lng, lat)
              reject()
            } else {
              resolve()
            }
          }
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    }).then(() => {
      this.ws && this.ws.close(100, '正常关闭')
      next()
    }, () => {
      next(false)
    })
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.map-container {
  box-sizing: border-box;
  width: 100%;

  position: relative;
  height: calc(100vh - 84px);
  padding: 25px;
  &.map-container-WPF {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    padding: 0 !important;
    margin: 0 !important;
    z-index: 2000;
  }
   .bm-view {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 15px 2px #a3b3b0;
  }
}
$ERROR: #f56c6c;
$SUCCESS: #67c23a;
$WARM: #e6a23c;
.icon-error {
  color: $ERROR !important;
}
.icon-success {
  color: $SUCCESS !important;
}
.icon-warm {
  color: $WARM !important;
}
.overlay-alarm {
  background-color: rgba(236, 245, 255, 0.73);
  svg, img {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  span {
    margin-left: 30px;
    vertical-align: middle;
    color: #606266;
    white-space: nowrap;
  }
}
</style>