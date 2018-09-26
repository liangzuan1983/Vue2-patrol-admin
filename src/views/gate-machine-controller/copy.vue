<template>
  <div>
    <span>客户端暂不支持Excel表格导出，请复制相关URL到最新版Chrome或者IE下操作</span>
    <el-input v-model="copyUrl" style="margin-top: 10px;" placeholder='Please input' :value="copyUrl" @click="handleFocus($event)">
      <el-button slot="append" @click="handleCopy($event)">复制</el-button>
    </el-input>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
export default {
  name: 'copy',
  data() {
    return {
      copyUrl: 'http://localhost:9527/#/gate-machine-controller/gateSearch'
    }
  },
  methods: {
    handleFocus(event) {
      event.target && event.target.select()
    },
    handleCopy(event) {
      clip(this.copyUrl, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>