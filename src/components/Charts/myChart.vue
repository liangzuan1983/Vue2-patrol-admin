<template>
  <div :class="className" :id="id" :style="{ height:height, width:width }"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
import { selectAlarmConfig } from '@/api/alarm-controller'
export default {
  name: 'myChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      alarmTypeListCache: null,
      chart: null
    }
  },
  mounted() {
    this.fetchAlarmTpyeList()
      .then((res) => {
        this.initChart()
      })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    fetchAlarmTpyeList() {
      return new Promise((resolve, reject) => {
        selectAlarmConfig().then(response => {
          this.alarmTypeListCache = response.data.content
          resolve()
        })
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '巡逻告警时间轴报告图标',
          x: 'center',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        // legend: {
        //   x: 'center',
        //   top: '10%',
        //   textStyle: {
        //     color: '#90979c'
        //   },
        //   selected: {
        //     'female': true,
        //     'male': true,
        //     'average': true
        //   },
        //   data: ['female', 'male', 'average']
        // }
        calculable: true,
        tooltip: {
          trigger: 'item'
          // formatter: '{a}: {b}<br />{c}'
        },
        grid: {
          borderWidth: 0,
          top: 110,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: [{
          type: 'time',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
          type: 'category',
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: 'rgba(255, 255, 255, 0.2)'
            },
            show: true
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          },
          data: this.category
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' },
          borderColor: '#90979c'

        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: 'alarm',
          type: 'scatter',
          itemStyle: {
            normal: {
              opacity: 0.8
            }
          },
          symbolSize: 20,
          data: [
            [1536168461332, '水压告警'],
            [1536368561332, '高温告警'],
            [1536768021332, '高温告警'],
            [1536868961332, '暴雨告警'],
            [1536968061332, '高温告警'],
            [1537068061332, '台风告警'],
            [1537070400000, '暴雨告警']
          ]
        }]
      })
    }
  },
  computed: {
    category() {
      const { alarmTypeListCache } = this
      if (!alarmTypeListCache || alarmTypeListCache.length <= 0) return []
      const ac = alarmTypeListCache.map((item) => {
        return item.alarmName
      })

      // 去重
      var r = []
      for (var i = 0, l = ac.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (ac[i] === ac[j]) { j = ++i }
        }
        r.push(ac[i])
      }
      return r
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>