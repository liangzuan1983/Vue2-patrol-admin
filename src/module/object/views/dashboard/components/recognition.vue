<template>
  <div class="face-recognition">
    <div class="app-component__head">
      <span class="title">人脸识别对比</span>
    </div>
    <div class="app-component__body">
      <div class="face-recognition-grid" v-for="(item, index) in source" :key="index">
        <div class="face-recognition-grid__box">
          <fancyBox :url="item.captureUrl" width="100%" height="100%" :open="false"></fancyBox>
        </div>
        <div class="face-recognition-grid__box">
          <el-progress :width="60" :stroke-width="1" type="circle" :percentage="+item.similarityThreshold"></el-progress>
          <span class="name">{{item.name}}</span>
        </div>
        <div class="face-recognition-grid__box">
          <fancyBox :url="item.registerUrl" width="100%" height="100%" :open="false"></fancyBox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { searchFaceRecognitionInfo } from '@object/api/dashboard'
import fancyBox from '@/components/fancybox'
export default {
  name: 'FaceRecognition',
  data() {
    return {
      source: null
    }
  },
  components: {
    fancyBox
  },
  created() { this.fetchSourceData() },
  mounted() {},
  methods: {
    fetchSourceData() {
      searchFaceRecognitionInfo().then(response => {
        if (!Array.isArray(response.data.rows)) return
        this.source = response.data.rows.splice(0, 4)
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
.face-recognition {
  margin-bottom: 0px !important;
  .app-component__body {
    width: 100%;
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-content: flex-start;
  }
  .face-recognition-grid {
    position: relative;
    width: 45%;
    height: 98px;
    margin-bottom: 8px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    &__box {
      width: 30%;
      text-align: center;
      .fancybox-thumbnails {
        /deep/ svg {
          width: 50px !important;
          height: 50px !important;
        }
      }
      .name {
        position: relative;
        display: inline-block;
      }
    }
  }
}
</style>