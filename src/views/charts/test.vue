<template>
  <div class='chart-container'>
    <div class="chart" :class="className" :id="id" :style="{height:height,width:width}"></div>
    <div class="chart" :class="className" :id="id2" :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
export default {
  name: 'test',
  mixins: [resize],
  props: {
    className: {
      type: String
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      chart: null,
      id2: 'chart2'
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const option = {
        backgroundColor: '#2c343c',
        visualMap: {
          // 不显示 visualMap 组件，只用于明暗度的映射
          show: false,
          // 映射的最小值为 80
          min: 80,
          // 映射的最大值为 600
          max: 600,
          inRange: {
            // 明暗度的范围是 0 到 1
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            data: [
              { value: 235, name: '视频广告' },
              { value: 274, name: '联盟广告' },
              { value: 310, name: '邮件营销' },
              { value: 335, name: '直接访问' },
              { value: 400, name: '搜索引擎' }
            ],
            roseType: 'angle',
            label: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            },
            itemStyle: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        ]
      }
      this.chart.setOption(option)

      const chart2 = echarts.init(document.getElementById(this.id2))
      const option2 = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      }
      chart2.setOption(option2)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  overflow-y: scroll;
  .chart {
    position: relative;
    box-sizing: border-box;
    padding: 20px;
  }
}
</style>