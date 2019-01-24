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
            <el-button style="float: right; padding: 3px 0" type="text" @click.stop="handleExpand(item.deviceId)">展开</el-button>
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
        <p>机器人：{{patrolDetail.name}}</p>
        <p>巡逻时间： {{patrolDetail.startTimeText}}  至  {{patrolDetail.endTimeText}}</p>
        <p style="margin-bottom: 5px">巡逻轨迹图片</p>
        <div class="fancybox-panel">
          <p style="width: 100%; text-align: center;">暂无图片</p>
        </div>
        <p style="margin-bottom: 5px">告警图片</p>
        <div class="fancybox-panel">
          <p style="width: 100%; text-align: center;">暂无图片</p>
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
    handleExpand(deviceId) {
      if (typeof deviceId === 'undefined') return
      this.reset()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        Promise.all([
          findPatrolReportDetail({ deviceId }),
          searchRecordList({ deviceId }),
          searchTemperatureRecordList({ deviceId })
        ]).then(([response1, response2, response3]) => {
          this.patrolDetail = response1.data
          this.recordList = response2.data
          this.temperatureRecordList = response3.data
          console.log('1', response1)
          console.log('2', response2)
          console.log('3', response3)
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
}
</style>
