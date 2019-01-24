<template>
  <div class="report">
    <div class="app-component__head">
      <span class="title">巡逻报表</span>
    </div>
    <div class="app-component__body">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>卡片名称</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
          {{'列表内容 ' + o }}
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  findAllPatrolReport } from '@object/api/dashboard'
export default {
  name: 'Report',
  data() {
    return {
      source: null
    }
  },
  created() { this.fetchSourceData() },
  mounted() {},
  methods: {
    fetchSourceData() {
      findAllPatrolReport().then(response => {
        if (!Array.isArray(response.data)) return
        this.source = this._.reverse(response.data)
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
    .box-card {
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.3);
    }
  }
}
</style>