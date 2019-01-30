<template>
  <div class="report">
    <div class="app-component__head">
      <span class="title">巡逻报表</span>
    </div>
    <div class="app-component__body">
      <el-scrollbar wrapClass="scrollbar-wrapper">
        <el-card class="box-card" v-for="(item, index) in source" :key="index" :body-style="{padding: '0 20px 20px 20px'}">
          <div slot="header" class="clearfix">
            <span>{{ item.robotName }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click.stop="handleExpand(item.id, item.beginTime, item.endTime)">展开</el-button>
          </div>
          <div class="item">{{'巡逻时间：' + item.beginTime + ' 至 ' + item.endTime }}</div>
          <div class="item">{{'巡逻次数：第 ' + item.patrolNumber + ' 次' }}</div>
          <div class="item">{{'告警次数：共 ' + item.alarmCount + ' 次' }}</div>
          <div class="item">{{'抓拍图片：共 ' + item.patrolCount + ' 张' }}</div>
        </el-card>
      </el-scrollbar>
    </div>

    <el-dialog custom-class="report-dialog" :append-to-body="true" title="巡逻报表详情" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModel" width="80%" top="8vh">
      <el-scrollbar>
        <p>机器人：{{patrolDetail.name || '无'}}</p>
        <p>巡逻时间： {{patrolDetail.startTimeText || '暂无'}}  至  {{patrolDetail.endTimeText || '暂无'}}</p>
        <p style="margin-bottom: 5px">巡逻轨迹图片</p>
        <div class="fancybox-panel">
          <p v-if="patrolDetail.locusPics && patrolDetail.locusPics.length < 1" style="width: 100%; text-align: center;">暂无图片</p>
          <el-scrollbar v-else :vertical="false">
            <div class="fancybox-panel__list">
              <div class="fancybox-panel__item" v-for="(item, index) in patrolDetail.locusPics" :key="index">
                <fancyBox :url="item.locusPic" width="200px" height="176px"></fancyBox>
                <div class="extraText">
                  <span style="float: left;">{{item.locusName || '无序号'}}</span>
                  <span style="float: right;">{{item.patrolEndTime || '无时间'}}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <p style="margin-bottom: 5px">告警图片</p>
        <div class="fancybox-panel">
          <p v-if="patrolDetail.alarmPics && patrolDetail.alarmPics.length < 1" style="width: 100%; text-align: center;">暂无图片</p>
          <el-scrollbar v-else :vertical="false">
            <div class="fancybox-panel__list">
              <div class="fancybox-panel__item" v-for="(item, index) in patrolDetail.alarmPics" :key="index">
                <fancyBox :url="item.picInfos[0].picUrl" width="200px" height="176px"></fancyBox>
                <div class="extraText">
                  <span style="float: left;">{{item.alarmTypeName || '无序号'}}</span>
                  <span style="float: right;">{{item.alarmTime || '无时间'}}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <p style="margin-bottom: 5px">巡逻图片</p>
        <div class="fancybox-panel">
          <p v-if="patrolDetail.patrolPics && patrolDetail.patrolPics.length < 1" style="width: 100%; text-align: center;">暂无图片</p>
          <el-scrollbar v-else :vertical="false">
            <div class="fancybox-panel__list">
              <div class="fancybox-panel__item" v-for="(item, index) in patrolDetail.patrolPics" :key="index">
                <fancyBox :url="item.picInfos[0].picUrl" width="200px" height="176px"></fancyBox>
                <div class="extraText">
                  <span style="float: left;">{{item.beaconPoint || '无序号'}}</span>
                  <span style="float: right;">{{item.patrolTime || '无时间'}}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <p style="margin-bottom: 5px">仪表记录列表</p>
        <el-table :data="recordList.rows" header-cell-class-name="header-cell" height="300px" :row-key="rowKey" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="设备编码">
            <template slot-scope="scope">{{scope.row.dev_code}}</template>
          </el-table-column>
          <el-table-column align="center" label="设备名称">
            <template slot-scope="scope">{{scope.row.devName}}</template>
          </el-table-column>
          <el-table-column align="center" label="面板编码">
            <template slot-scope="scope">{{scope.row.panelCode}}</template>
          </el-table-column>
          <el-table-column align="center" label="面板名称">
            <template slot-scope="scope">{{scope.row.panelName}}</template>
          </el-table-column>
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">{{scope.row.time}}</template>
          </el-table-column>
          <el-table-column align="center" label="图片">
            <template slot-scope="scope">
              <fancy-box :url="scope.row.picUrl"></fancy-box>
            </template>
          </el-table-column>
          <el-table-column align="center" label="目标编号">
            <template slot-scope="scope">{{scope.row.targetNo}}</template>
          </el-table-column>
          <el-table-column align="center" label="目标名称">
            <template slot-scope="scope">{{scope.row.targetName}}</template>
          </el-table-column>
           <el-table-column align="center" label="类型">
            <template slot-scope="scope">{{scope.row.type}}</template>
          </el-table-column>
          <el-table-column align="center" label="当前值">
            <template slot-scope="scope">{{scope.row.currentValue}}</template>
          </el-table-column>
          <el-table-column align="center" label="是否异常">
            <template slot-scope="scope">{{scope.row.isError}}</template>
          </el-table-column>
        </el-table>
        <p style="margin-bottom: 5px">热成像温度列表</p>
        <el-table :data="temperatureRecordList.rows" header-cell-class-name="header-cell" height="300px" :row-key="rowKey" border fit highlight-current-row style="width: 100%">
          <el-table-column align="center" label="检测点编号">
            <template slot-scope="scope">{{scope.row.targetNo}}</template>
          </el-table-column>
          <el-table-column align="center" label="监测点名称">
            <template slot-scope="scope">{{scope.row.targetName}}</template>
          </el-table-column>
          <el-table-column align="center" label="时间">
            <template slot-scope="scope">{{scope.row.time}}</template>
          </el-table-column>
          <el-table-column align="center" label="图片">
            <template slot-scope="scope">
              <fancy-box :url="scope.row.picUrl"></fancy-box>
            </template>
          </el-table-column>
          <el-table-column align="center" label="检测值">
            <template slot-scope="scope">{{scope.row.currentValue}}</template>
          </el-table-column>
          <el-table-column align="center" label="是否异常">
            <template slot-scope="scope">{{scope.row.isError}}</template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import {
  findAllPatrolReport,
  findPatrolReportDetail,
  searchRecordList,
  searchTemperatureRecordList } from '@object/api/dashboard'

import fancyBox from '@/components/fancybox'

export default {
  name: 'Report',
  data() {
    return {
      closeOnClickModel: false,
      dialogFormVisible: false,
      source: null,
      patrolDetail: {},
      recordList: {},
      temperatureRecordList: {}
    }
  },
  components: {
    fancyBox
  },
  created() { this.fetchSourceData() },
  mounted() {},
  methods: {
    rowKey(row) {
      return row.id
    },
    fetchSourceData() {
      findAllPatrolReport().then(response => {
        if (!Array.isArray(response.data)) return
        this.source = this._.reverse(response.data)
      })
    },
    reset() {
      this.patrolDetail = {}
      this.recordList = {}
      this.temperatureRecordList = {}
    },
    handleExpand(statId, beginTime, endTime) {
      if (typeof statId === 'undefined') return
      this.reset()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        Promise.all([
          findPatrolReportDetail({ statId }),
          searchRecordList({ beginTime, endTime }),
          searchTemperatureRecordList({ beginTime, endTime })
        ]).then(([response1, response2, response3]) => {
          this.patrolDetail = response1.data[0]
          this.recordList = response2.data
          this.temperatureRecordList = response3.data
        }, (err) => {
          console.log(err)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 遵循BEM的命名方式
.block{}
.block__element{}
.block--modifier{} */
.report {
  position: relative;
  width: 100%;
  margin-bottom: 0px !important;
  .app-component__body {
    flex: 1;
    overflow: hidden;
    /deep/ .el-scrollbar {
      height: 100%;
      .scrollbar-wrapper {
        height: 100%;
        overflow-x: hidden;
      }
    }
    .box-card {
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
      margin-bottom: 15px;
      .item {
        margin: 5px 0;
      }
    }
  }
}

/deep/ .report-dialog {
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: 85%;
  .el-dialog__body {
    flex: 1;
    overflow: hidden;
    .el-scrollbar {
      height: 100%;
      &__wrap {
        overflow-x: hidden !important;
      }
    }
  }
  p {
    font-size: 1.1rem;
  }
  .fancybox-panel {
    position: relative;
    height: 220px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    border: 1px dashed rgba(0,0,0,.3);
    /deep/ .el-scrollbar {
      width: 100%;
      height: 95%;
      padding-bottom: 10px;
      .is-vertical {
        display: none;
      }
      &__wrap {
        overflow: hidden;
      }
      &__view {
        position: relative;
        display: inline-block;
        height: 100%;
        width: auto;
        overflow: hidden;
      }
    }
    &__list {
      display: inline-block;
      margin: 0;
      padding: 0;
      height: 100%;
      white-space: nowrap;
      &:after {
        content: "";
        display: table;
        clear: both;
      }
    }
    &__item {
      position: relative;
      width: 200px;
      height: 100%;
      border-radius: 2px;
      margin: 0 7.5px;
      user-select: none;
      display: inline-block;
      &:first-child {
        margin-left: 15px;
      }
      &:last-child {
        margin-right: 30px;
      }
    }
  }
  .el-table {
    margin-top: 15px;
  }
  .header-cell {
    background-color: rgba(60, 172, 197, 0.4);
  }
}
</style>
