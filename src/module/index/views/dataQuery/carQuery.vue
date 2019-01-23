<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item">
        <span>车牌号</span>
        <el-input type="text" placeholder="输入车牌号" v-model="listQuery.carNum" style="width: 200px; margin-left: 15px"  @keyup.enter.native="handleFilter"/>
      </div>
      <div class="filter-item">
        <span>种类</span>
        <el-select v-model="listQuery.type" placeholder="请选择" @change="handleFilter">
          <el-option
            v-for="(item, index) in category"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="inline-timePick filter-item">
        <span>时刻</span>
        <el-date-picker
          style="margin-left: 15px"
          v-model="listQuery.time"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          value-format='yyyy-MM-dd hh:mm:ss'>
        </el-date-picker>
      </div>

      <el-button style="margin-left: 10px" class="filter-item" type="primary" size="" v-waves icon="el-icon-search" @click.native="handleFilter">搜索</el-button>
    </div>

    <el-table :data="list" :row-key="rowKey" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="车牌号" width="150px">
        <template slot-scope="scope">
          {{scope.row.carNumber}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="种类" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.carType | filterType}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="位置"> 
        <template slot-scope="scope">
          <span>{{scope.row.position || '暂无描述'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.captureTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="抓拍照" v-bind:loading="true">
        <template slot-scope="scope">
          <fancyBox :url="scope.row.carImgUrl"></fancyBox>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { selectCarRecordInfoByParams } from '@index/api/dataQuery'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
import fancyBox from '@/components/fancybox'
const MIME = [{ 'label': '全部', 'value': null }, { 'value': 0, 'label': '未知' }, { 'value': '1', 'label': '小型车' }, { 'value': '2', 'label': '中型车' }, { 'value': '3', 'label': '大型车' }, { 'value': '4', 'label': '摩托车' }, { 'value': '11', 'label': '轿车' }, { 'value': '12', 'label': '微型面包车' }, { 'value': '13', 'label': '大客车' }, { 'value': '14', 'label': '大货车' }, { 'value': '15', 'label': '三轮车' }, { 'value': '16', 'label': '二轮车' }, { 'value': '17', 'label': '行人' }, { 'value': '22', 'label': '越野车' }, { 'value': '23', 'label': '商务车' }, { 'value': '24', 'label': '小货车' }, { 'value': '26', 'label': '轻型客车' }, { 'value': '27', 'label': '小型客车' }, { 'value': '31', 'label': '皮卡' }, { 'value': '32', 'label': '挂车' }, { 'value': '33', 'label': '混凝土搅拌车' }, { 'value': '34', 'label': '罐车' }, { 'value': '35', 'label': '随车吊' }, { 'value': '36', 'label': '消防车' }, { 'value': '37', 'label': '渣土车' }, { 'value': '38', 'label': '押运车' }, { 'value': '39', 'label': '工程抢修车' }, { 'value': '40', 'label': '救援车' }, { 'value': '41', 'label': '栏板卡车' }]
export default {
  name: 'carQuery',
  components: {
    fancyBox
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: null,
      listQuery: {
        page: 1, // 当前页码
        limit: 10,
        time: null,
        type: null,
        carNum: null
      },
      category: MIME,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', start)
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', start)
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', start)
          }
        }]
      }
    }
  },
  filters: {
    filterType(type) {
      if (typeof type === 'undefined') return '未识别的车辆类型'
      let txt = '未知'
      MIME.some(item => {
        if (+item.value === +type) {
          txt = item.label
          return true
        }
        return false
      })
      return txt
    }
  },
  directives: {
    waves
  },
  created() {
    this.getList()
  },
  methods: {
    rowKey(row) {
      return row.id
    },
    getList() {
      const that = this
      that.listLoading = true
      return new Promise(function(resolve, reject) {
        selectCarRecordInfoByParams(that.listQuery).then(response => {
          that.list = response.data.content
          that.total = response.data.totalElements
          that.listLoading = false
          resolve()
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* 遵循BEM的命名方式
.block{}
.block__element{}
.block--modifier{} */
</style>