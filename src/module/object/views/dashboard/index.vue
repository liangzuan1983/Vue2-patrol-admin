<template>
  <div class="app-container">
    <el-row :gutter="15" style="height: 100%;">
      <el-col :sm="6" :md="5" style="height: 100%;">
        <div class="app-content app-content__left flex">
          <div class="robot-statistics"></div>
          <div class="alarm-abstract flow"></div>
        </div>
      </el-col>
      <el-col :sm="18" :md="14" style="height: 100%;">
        <div class="app-content app-content__center flex">
          <Patrol></Patrol>
          <div class="flow">
            <div class="gis"></div>
            <div class="face-recognition"></div>
          </div>
        </div>
      </el-col>
      <el-col hidden-md-only :sm="6" :md="5" style="height: 100%;">
        <div class="app-content app-content__right">
          <Report></Report>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Patrol from './components/patrol'
import Report from './components/report'
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  components: {
    Patrol,
    Report
  },
  created() {},
  mounted() {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 遵循BEM的命名方式
.block{}
.block__element{}
.block--modifier{} */
.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 5px;
  .app-content {
    position: relative;
    height: 100%;
    &.flex {
      display: flex;
      -ms-flex-flow: column nowrap;
      flex-flow: column nowrap;

      .flow {
        flex: 1;
      }
    }
  }
}
</style>