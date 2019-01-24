<template>
  <div class="app-container">
    <el-row :gutter="15" style="height: 100%;">
      <!-- left -->
      <el-col :sm="6" :md="5" style="height: 100%;">
        <div class="app-content app-content__left flex-column">
          <!-- 机器人数据统计 -->
          <div class="robot-statistics app-component">
            <div class="app-component__head">
              <span class="title">机器人数据统计</span>
            </div>
            <div class="app-component__body">
              <div class="statistics-tag" v-for="(value, key) in statistics" :key="key">
                <span class="statistics-tag__icon"><svg-icon :icon-class="key | filterIcon" /></span>
                <div class="statistics-tag__msg">
                  <span class="subtitle">{{ key | filterName }}</span>
                  <countTo class="num" :startVal="0" :endVal="value" :duration="duration"></countTo>
                </div>
              </div>
            </div>
          </div>
          <!-- 巡逻日报 -->
          <div class="patrol-statistics app-component">
            <div class="app-component__head">
              <h1>巡逻日报</h1>
            </div>
            <div class="app-component__body">
              <div class="statistics-tag" v-for="(value, key) in computedPatrolByDay" :key="key">
                <div class="statistics-tag__msg">
                  <countTo class="num" :startVal="0" :endVal="value" :duration="duration"></countTo>
                  <span class="subtitle">{{ key | filterName2 }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 告警信息 -->
          <div class="alarm-abstract flow flex-column app-component">
            <div class="app-component__head">
              <span class="title">告警信息</span>
            </div>
            <div class="app-component__body">
              <el-table
                :data="alarmList"
                height="100%"
                style="width: 100%">
                <el-table-column
                  prop="alarmName"
                  label="告警名称"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="alarmBeginTime"
                  label="告警时间">
                </el-table-column>
                <el-table-column align="center" label="等级" width="50">
                  <template slot-scope="scope">{{scope.row.alarmLevel | filterAlarmLevel}}</template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
      <!-- center -->
      <el-col :sm="18" :md="14" style="height: 100%;">
        <div class="app-content app-content__center flex-column">
          <!-- 上层 -->
          <div>
            <!-- 告警总数 -->
            <div class="app-component chart alarmTotal">
              <div class="app-component__head">
                <span class="title">告警总数</span>
              </div>
              <div class="app-component__body" style="height: 240px;">
                <v-chart :autoResize="true" :options="computedAlarmTotalOption" class="vchart"></v-chart>
                <div class="extraTxt">
                  <countTo class="num" :startVal="0" :endVal="patrolByDay ? patrolByDay.patrolInfo.alarmTotal : 0" :duration="duration"></countTo>
                  <span class="subtitle">Total</span>
                </div>
              </div>
            </div>
            <!-- 人脸识别总数 -->
            <div class="app-component chart face">
              <div class="app-component__head">
                <span class="title">人脸识别总数</span>
              </div>
              <div class="app-component__body" style="height: 240px;">
                <v-chart :autoResize="true" :options="computedFaceOption" class="vchart"></v-chart>
                <div class="extraTxt">
                  <countTo class="num" :startVal="0" :endVal="computedFaceTotal" :duration="duration"></countTo>
                  <span class="subtitle">Total</span>
                </div>
              </div>
            </div>
            <!-- 告警类型统计 -->
            <div style="height: 285px;" class="app-component chart alarmType">
              <div class="app-component__head">
                <span class="title">告警类型统计</span>
              </div>
              <div class="app-component__body" style="height: 225px;">
                <v-chart :autoResize="true" :options="computedAlarmTypeOption" class="vchart"></v-chart>
              </div>
            </div>
            <!-- 机器人统计 -->
            <div style="height: 285px;" class="app-component chart robot">
              <div class="app-component__head">
                <span class="title">机器人统计</span>
              </div>
              <div class="app-component__body" style="height: 225px;">
                <el-table
                  :data="computedPatrolRobotData"
                  height="100%"
                  style="width: 100%">
                  <el-table-column
                    fixed
                    prop="robotName"
                    label="机器人"
                    width="120">
                  </el-table-column>
                  <el-table-column
                     align="center"
                    prop="alarmTotal"
                    :formatter="formatter"
                    label="告警总数">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="patrolTotal"
                    :formatter="formatter"
                    label="巡逻总数"
                    >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="captureTotal"
                    :formatter="formatter"
                    label="抓拍总数"
                    >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="faceRecTotal"
                    label="已识别人脸总数"
                    :formatter="formatter"
                    width="120"
                    >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    prop="faceUnRecTotal"
                    label="陌生人脸总数"
                    :formatter="formatter"
                    width="120"
                    >
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <!-- 下层 -->
          <div class="flow">
            <GIS class="app-component flex-column "></GIS>
            <face-recognition class="app-component flex-column"></face-recognition>
          </div>
        </div>
      </el-col>
      <!-- right -->
      <el-col hidden-md-only :sm="6" :md="5" style="height: 100%;">
        <div class="app-content app-content__right flex-column">
          <div class="alarm-state app-component">
            <div class="app-component__head">
              <span class="title">告警状态</span>
            </div>
            <div class="app-component__body" style="height: 240px;">
              <v-chart :autoResize="true" :options="computedAlarmStateOption" class="vchart"></v-chart>
            </div>
          </div>
          <Report class="flow app-component flex-column"></Report>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Report, GIS, FaceRecognition } from './components'
import {
  getDevicesGroupByStatus,
  selectAlarmRecord,
  patrolReportGroupByDay } from '@object/api/dashboard'

import countTo from 'vue-count-to'
import ECharts from '@/components/Charts/ECharts.vue'
/* eslint-disable no-unused-vars */
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

export default {
  name: 'Dashboard',
  data() {
    return {
      duration: 3000, // vue-cont-to 数字滚动的时间
      statistics: null,
      patrolByDay: null,
      alarmList: null,
      alarmTypeOption: {
        grid: {
          width: '100%',
          height: 190,
          top: '12%',
          left: '0%',
          bottom: '0%',
          right: '0%',
          backgroundColor: 'transparent',
          containLabel: true
        },
        tooltip: {},
        legend: {
          show: false
        },
        dataset: {
          // 提供一份数据。
          source: [[]]
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0
          }
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: {
          name: '次数',
          nameTextStyle: {},
          axisLine: {
            lineStyle: {}
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              type: 'dashed'
            }
          }
        },
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [{
          type: 'bar',
          barMaxWidth: 30,
          itemStyle: {
            color: function(params) {
              // build a color map as your need.
              const colorList = ['#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0']
              return colorList[params.dataIndex]
            }
          }
        }]
      },
      alarmTotalOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right'
        },
        calculable: true,
        series: [
          {
            name: '数据呈现',
            type: 'pie',
            radius: '70%',
            center: ['35%', '50%'],
            data: []
          }
        ]
      },
      faceOption: {
        color: ['#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0', '#C1232B', '#27727B', '#9BCA63', '#E87C25', '#FE8463', '#FAD860'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right'
        },
        calculable: true,
        series: [
          {
            name: '数据呈现',
            type: 'pie',
            radius: '70%',
            center: ['35%', '50%'],
            data: []
          }
        ]
      },
      alarmStateOption: {
        color: ['#26C0C0', '#27727B', '#9BCA63', '#E87C25', '#FE8463'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right'
        },
        calculable: true,
        series: [
          {
            name: '数据呈现',
            type: 'pie',
            radius: '68%',
            center: ['45%', '50%'],
            data: []
          }
        ]
      }
    }
  },
  filters: {
    filterName(val) {
      if (!val) return '未知'
      let txt = '未知'
      switch (val) {
        case 'ChargeNum':
          txt = '正在充电'
          break
        case 'manualNum':
          txt = '手动控制'
          break
        case 'offlineNum':
          txt = '离线'
          break
        case 'onDutyNum':
          txt = '正在值守'
          break
        case 'patrolNum':
          txt = '正在巡逻'
          break
        case 'robotTotal':
          txt = '机器人总数'
          break
      }
      return txt
    },
    filterName2(val) {
      let txt = '未知'
      switch (val) {
        case 'patrol':
          txt = '巡逻总数'
          break
        case 'capture':
          txt = '抓拍总数'
          break
        case 'robotNum':
          txt = '机器人总数'
          break
      }
      return txt
    },
    filterIcon(val) {
      let txt = 'configuration'
      switch (val) {
        case 'ChargeNum':
          txt = 'battery'
          break
        case 'manualNum':
          txt = 'control'
          break
        case 'offlineNum':
          txt = 'offline'
          break
        case 'onDutyNum':
          txt = 'hour_24'
          break
        case 'patrolNum':
          txt = 'path'
          break
        case 'robotTotal':
          txt = 'robot'
          break
      }
      return txt
    },
    filterAlarmLevel(val) {
      let txt = '低'
      switch (+val) {
        case 3:
          txt = '高'
          break
        case 2:
          txt = '中'
          break
        default:
          txt = '低'
      }
      return txt
    }
  },
  components: {
    Report,
    GIS,
    FaceRecognition,
    countTo,
    'v-chart': ECharts
  },
  created() {
    this.fetchSourceData()
  },
  mounted() {},
  methods: {
    fetchSourceData() {
      getDevicesGroupByStatus().then(res => {
        this.statistics = res.data
      })
      selectAlarmRecord({ limit: 20 }).then(res => {
        this.alarmList = res.data.content
      })
      patrolReportGroupByDay().then(res => {
        this.patrolByDay = res.data
      })
    },
    formatter(row, column, value) {
      if (!value) return '暂无'
      return value
    }
  },
  computed: {
    computedPatrolRobotData() {
      if (!this.patrolByDay) return []
      return this.patrolByDay.patrolInfo.robotPatrols
    },
    computedPatrolByDay() {
      if (!this.patrolByDay) return null
      const { patrolTotal: patrol, captureTotal: capture, robotPatrols } = this.patrolByDay.patrolInfo
      return {
        patrol,
        capture,
        robotNum: robotPatrols ? robotPatrols.length : 0
      }
    },
    computedAlarmTypeOption() {
      const { patrolByDay, alarmTypeOption } = this

      if (!patrolByDay) return alarmTypeOption

      const { alarmTypes } = patrolByDay.patrolInfo
      if (!Array.isArray(alarmTypes) || alarmTypes.length < 1) return alarmTypeOption
      const arr = alarmTypes.map((item) => {
        return [item.alarmName, +item.alarmCount]
      })
      arr.unshift(['告警类型', '次数'])

      return this._.merge({}, { dataset: { source: arr }}, alarmTypeOption)
    },
    computedAlarmTotalOption() {
      const { patrolByDay, alarmTotalOption } = this

      if (!patrolByDay) return alarmTotalOption
      const { patrolInfo } = patrolByDay
      const opt = {
        legend: {
          data: ['高级告警', '中级告警', '低级告警']
        },
        series: [
          {
            data: [
              { value: +patrolInfo.firstLevel || 0, name: '高级告警' },
              { value: +patrolInfo.secondLevel || 0, name: '中级告警' },
              { value: +patrolInfo.thirdLevel || 0, name: '低级告警' }
            ]
          }
        ]
      }
      return this._.merge({}, alarmTotalOption, opt)
    },
    computedFaceOption() {
      const { patrolByDay, faceOption } = this

      if (!patrolByDay) return faceOption
      const { patrolInfo } = patrolByDay
      const opt = {
        legend: {
          data: ['已识别人员', '陌生人']
        },
        series: [
          {
            data: [
              { value: +patrolInfo.faceRecTotal || 0, name: '已识别人员' },
              { value: +patrolInfo.faceUnRecTotal || 0, name: '陌生人' }
            ]
          }
        ]
      }
      return this._.merge({}, faceOption, opt)
    },
    computedAlarmStateOption() {
      const { patrolByDay, alarmStateOption } = this

      if (!patrolByDay) return alarmStateOption
      const { patrolInfo } = patrolByDay
      const opt = {
        legend: {
          data: ['激活告警', '已确认告警', '已关闭告警']
        },
        series: [
          {
            data: [
              { value: +patrolInfo.activeAlarmCount || 0, name: '激活告警' },
              { value: +patrolInfo.confirmAlarmCount || 0, name: '已确认告警' },
              { value: +patrolInfo.closeAlarmCount || 0, name: '已关闭告警' }
            ]
          }
        ]
      }
      return this._.merge({}, alarmStateOption, opt)
    },
    computedFaceTotal() {
      const { patrolByDay } = this
      if (!patrolByDay) return 0
      return (patrolByDay.patrolInfo.faceUnRecTotal + patrolByDay.patrolInfo.faceRecTotal)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 遵循BEM的命名方式
.block{}
.block__element{}
.block--modifier{} */
$--color-text-primary: #303133 !default;
$--color-text-regular: #606266 !default;
$--color-text-secondary: #909399 !default;
$--color-text-placeholder: #c0c4cc !default;

$--component-background: #fff;
$--conponent-border-radius: 2px;
$--conponent-padding: 10px 15px;
$--component-marginBottom: 15px;

@mixin clearfix {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
}

%extraText {
  .extraTxt {
    position: absolute;
    right: 3%;
    bottom: 12%;
    width: 100px;
    & > span {
      display: inline-block;
      width: 100%;
      text-align: right;
    }
    .num {
      font-size: 4.2rem;
    }
    .subtitle {
      color: $--color-text-secondary;
      font-size: 14px;
    }
  }
}

.padding {
  background-color: #fff;
  padding: 10px 15px;
}
.border-radius {
  border-radius: 2px;
}
.flex-column {
  display: flex;
  -ms-flex-flow: column nowrap;
  flex-flow: column nowrap;

}
.flex-row {
  display: flex;
  -ms-flex-flow: row nowrap;
  flex-flow: row nowrap;
}
.flow {
  position: relative;
  flex: 1;
  @include clearfix;
}
.vchart {
  width: 100%;
  height: 100%;
}
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1440px;
  min-height: 900px;
  padding: 10px 15px;
  .app-content {
    position: relative;
    height: 100%;
    /deep/ .app-component {
      position: relative;
      margin-bottom: $--component-marginBottom;
      background-color: $--component-background;
      border-radius: $--conponent-border-radius;
      padding: $--conponent-padding;
      overflow: hidden;
      &__head {
        position: relative;
        color: $--color-text-regular;
        line-height: 30px;
        height: 30px;
        font-size: 1.12rem;
      }
      &__body {
        position: relative;
        margin-top: 10px;
      }
    }
    .robot-statistics {
      height: 300px;
      .app-component__body {
        position: relative;
        margin-top: 15px;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-content: center;
        .statistics-tag {
          position: relative;
          display: inline-block;
          width: 105px;
          height: 80px;
          margin-bottom: 40px;
          &__icon {
            width: 24px;
            height: 100%;
            float: left;
            zoom: 1;
            vertical-align: middle;
            svg {
              color: #031264;
              width: 100%;
              height: 100%
            }
          }
          &__msg {
            height: 100%;
            position: relative;
            overflow: hidden;
            zoom: 1;
            vertical-align: middle;
            .subtitle {
              display: inline-block;
              width: 100%;
              text-align: center;
              margin-top: 8px;
              font-size: 12px;
              color: $--color-text-secondary;
            }
            .num {
              position: relative;
              display: inline-block;
              width: 100%;
              text-align: center;
              margin-top: 10px;
              font-size: 2.7rem;
            }
          }
        }
      }
    }
    .patrol-statistics {
      height: 285px;
      .app-component__head {
        margin-top: 35px;
        text-align: center;
        font-size: inherit;
      }
      .app-component__body {
        position: relative;
        margin-top: 55px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        .statistics-tag {
          position: relative;
          display: inline-block;
          width: 105px;
          height: 80px;
          &__msg {
            height: 100%;
            position: relative;
            overflow: hidden;
            zoom: 1;
            vertical-align: middle;
            .subtitle {
              display: inline-block;
              width: 100%;
              text-align: center;
              margin-top: 8px;
              font-size: 12px;
              color: $--color-text-secondary;
            }
            .num {
              position: relative;
              display: inline-block;
              width: 100%;
              text-align: center;
              margin-top: 10px;
              font-size: 2.7rem;
            }
          }
        }
      }
    }
    .alarm-abstract {
      margin-bottom: 0px;
      .app-component__body {
        flex: 1;
        position: relative;
      }
    }
    .alarm-state {
      position: relative;
      height: 300px;
    }
    .face, .alarmTotal {
      @extend %extraText;
    }
    .GIS {
     position: relative;
     width: 49.5%;
     height: 100%;
     float: left;
    }
    .face-recognition {
      width: 49.5%;
      float: right;
      height: 100%;
    }
  }

  .app-content__center > div:first-child {
    flex: 0 0 600px;
    width: 100%;
    height: 600px;
    min-width: 600px;
    margin-bottom: $--component-marginBottom;
    display: flex;
    flex-flow: row wrap;
    align-content: space-between;
    justify-content: space-between;
    .chart {
      position: relative;
      height: 300px;
      width: 49.5%;
    }
  }
}
</style>