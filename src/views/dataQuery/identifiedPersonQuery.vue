<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item">
        <span>姓名</span>
        <el-input type="text" placeholder="输入姓名" v-model="listQuery.name" style="width: 200px;"  @keyup.enter.native="handleFilter"/>
      </div>
      <div class="filter-item">
        <span>种类</span>
        <el-select v-model="listQuery.category" placeholder="请选择" @change="handleFilter">
          <el-option
            v-for="(item, index) in category"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="inline-timePick filter-item">
        <span>时间</span>
        <el-date-picker
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
      <el-table-column align="center" label="姓名" width="150px">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="种类" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.category | parseCategory}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="位置"> 
        <template slot-scope="scope">
          <span>{{scope.row.position || '暂无描述'}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.time | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="抓拍照" v-bind:loading="true">
        <template slot-scope="scope">
          <fancyBox :url="scope.row.captureUrl"></fancyBox>
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
import { selectCaptureFacesInfo } from '@/api/dataQuery'
import { parseTime } from '@/utils'
import waves from '@/directive/waves'
import fancyBox from '@/components/fancybox'

const MIME = [
  {
    label: '全部',
    value: null
  },
  {
    value: 1,
    label: '白名单人员'
  }, {
    value: 2,
    label: '黑名单人员'
  }, {
    value: 3,
    label: '灰名单人员'
  }, {
    value: 4,
    label: 'VIP人员'
  }, {
    value: 5,
    label: '一级人员'
  }, {
    value: 6,
    label: '二级人员'
  }, {
    value: 7,
    label: '三级人员'
  }, {
    value: 8,
    label: '四级人员'
  }, {
    value: 9,
    label: '内部人员'
  }, {
    value: 10,
    label: '外部人员'
  }
]
export default {
  name: 'personQuery',
  components: {
    fancyBox
  },
  filters: {
    parseCategory(category) {
      let txt = '未知人员'
      if (typeof category === 'undefined') return txt

      const type = MIME

      type.some(item => {
        if (item.value === +category) {
          txt = item.label
        }
      })

      return txt
    },
    parseTime
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
        category: '',
        hasRecognition: '已识别',
        name: null
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
        selectCaptureFacesInfo(that.listQuery).then(response => {
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