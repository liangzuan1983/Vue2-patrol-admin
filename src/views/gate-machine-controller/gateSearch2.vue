<template>
  <div class="app-container"> 
    <div class="filter-container">
      <div class="inline-timePick">
        <span class="demonstration">开始时刻</span>
        <el-date-picker
          style="margin: 0 15px"
          v-model="listQuery.enterDoorTimeBegin"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          value-format='yyyy-MM-dd hh:mm:ss'>
        </el-date-picker>
      </div>

      <div class="inline-timePick">
        <span class="demonstration">结束时刻</span>
        <el-date-picker
          style="margin: 0 15px"
          v-model="listQuery.enterDoorTimeEnd"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          value-format='yyyy-MM-dd hh:mm:ss'>
        </el-date-picker>
      </div>

      <el-autocomplete
        class="inline-input"
        v-model="listQuery.cardNumber"
        :fetch-suggestions="handleAutocomplete"
        placeholder="请输入门禁卡号"
        @select="handleSelect"
        @change="handleFilter"
      ></el-autocomplete>

      <el-button style="margin-left: 10px" class="filter-item" type="primary" size="" v-waves icon="el-icon-search" @click.native="handleFilter">搜索</el-button>
      <el-button 
        style="float: right;margin-left: 10px" 
        class="filter-item" 
        type="success" 
        size="small" 
        :loading="downloadLoading"
        v-waves @click.native="handleExcel">
        <svg-icon style="margin-right: 5px" icon-class="excel" />导出Excel</el-button>
    </div>
    
    <el-table :data="list" :row-key="rowKey" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="门禁卡号" width="100px">
        <template slot-scope="scope">
          <el-tag>{{scope.row.cardNumber}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="进门事由" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.forWhat || '暂无描述'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="进门人数" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.followNum || 0}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="出门事由" width="160px">
        <template slot-scope="scope">
          <span>{{scope.row.forWhatOut || '暂无描述'}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="出门人数" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.followNumOut || 0}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="进门时间">
        <template slot-scope="scope">
          <span>{{scope.row.enterDoorTIME | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="出门时间">
        <template slot-scope="scope">
          <span>{{scope.row.outerDoorTIME | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="进门地点">
        <template slot-scope="scope">
          <span>{{scope.row.enterPlace || "暂无描述"}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="出门地点">
        <template slot-scope="scope">
          <span>{{scope.row.outerPlace || "暂无描述"}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120px" label="抓拍照" v-bind:loading="true">
        <template slot-scope="scope">
          <!-- <i v-if="!scope.row.catchPic" style="font-size: 16px" class="el-icon-loading table-column-icon"></i> -->
          <fancyBox :url="scope.row.catchPic"></fancyBox>
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
import { selectPassPersonInfo } from '@/api/gate-machine-controller'
import { parseTime, CapitalizeFirstLetter } from '@/utils'
import waves from '@/directive/waves'
import fancyBox from '@/components/fancybox'

export default {
  name: 'gateSearch',
  components: {
    fancyBox
  },
  directives: {
    waves
  },
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      total: null,
      listQuery: {
        page: 1, // 当前页码
        limit: 10,
        cardNumber: null,
        enterDoorTimeBegin: null,
        enterDoorTimeEnd: null
      },
      cardNumberList: null,
      cardNumberListLoading: true,
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
      },
      downloadLoading: false,
      filename: '门岗查询',
      autoWidth: true
    }
  },
  created() {
    this.getCardNumberList()
    // const that = this
    // !(async function action() {
    //   await that.getList()
    //   await that.getCardNumberList()
    // })()
  },
  methods: {
    rowKey(row) {
      return row.id
    },
    getList() {
      const that = this
      that.listLoading = true
      return new Promise(function(resolve, reject) {
        selectPassPersonInfo(that.listQuery).then(response => {
          that.list = response.data.content
          that.total = response.data.totalElements
          that.listLoading = false
          resolve()
        })
      })
    },
    getCardNumberList() {
      const that = this
      that.listLoading = true
      that.cardNumberListLoading = true
      return new Promise(function(resolve, reject) {
        selectPassPersonInfo(Object.assign({}, that.listQuery, { limit: 50 })).then(response => {
          that.cardNumberList = response.data.content
          that.list = response.data.content.slice(0, that.listQuery.limit)
          that.total = response.data.totalElements
          that.cardNumberListLoading = false
          that.listLoading = false
          resolve()
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleExcel() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const field = ['id', 'cardNumber', 'forWhat', 'followNum', 'forWhatOut', 'followNumOut', 'enterDoorTIME', 'outerDoorTIME', 'enterPlace', 'outerPlace', 'catchPic']
        const list = this.list
        const data = this.formatJson(field, list)

        excel.export_json_to_excel({
          header: field.map((key) => { return CapitalizeFirstLetter(key) }),
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'enterDoorTIME' || j === 'outerDoorTIME') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleFancyBox(event) {},
    handleAutocomplete(queryString, cb) {
      var cardNumberList = this.cardNumberAutoComplete
      var results = queryString ? cardNumberList.filter(this.createFilter(queryString)) : cardNumberList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (cardNumber) => {
        return cardNumber.value && (cardNumber.value.toString().toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      this.handleFilter()
    }
  },
  computed: {
    cardNumberAutoComplete() {
      const { cardNumberList } = this
      if (!cardNumberList || cardNumberList.length <= 0) return []
      const ac = cardNumberList.map((item) => {
        return { label: item.cardNumber + '', value: item.cardNumber + '', id: item.id }
      })
      ac.splice(0, 0, { label: '全部', value: null, id: '-1' })
      // 去重
      var r = []
      for (var i = 0, l = ac.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (ac[i].value === ac[j].value) { j = ++i }
        }
        r.push(ac[i])
      }
      return r
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-column-img {
  width: 1.4rem;
  height: 1.4rem;
  color: #999;
  cursor: pointer;
  vertical-align: middle;
}

.table-column-icon {
  font-size: 18px;
  vertical-align: middle;
}

.inline-timePick, .inline-input {
  display: inline-block;
  margin-bottom: 10px;
  vertical-align: middle;
}
</style>