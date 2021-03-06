<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="inline-timePick">
        <span class="demonstration">开始时刻</span>
        <el-date-picker
          style="margin: 0 15px"
          v-model="listQuery.alarmStartTimeBegin"
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
          v-model="listQuery.alarmStartTimeEnd"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          value-format='yyyy-MM-dd hh:mm:ss'>
        </el-date-picker>
      </div>
      
      <el-select v-model="listQuery.alarmType" v-loading="alarmTypeListLoading" filterable placeholder="请选择告警代码" class="filter-item" @change="handleFilter">
        <el-option
          v-for="item in alarmTypeAutoComplete"
          :key="item.id"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 10px" class="filter-item" type="primary" size="" v-waves icon="el-icon-search" @click.native="handleFilter">搜索</el-button>
    </div>

    <div class="filter-container" style="padding-bottom: 35px">
        <el-button 
        style="float: right;margin-left: 10px" 
        class="filter-item" 
        type="success" 
        size="small" 
        :loading="downloadLoading" 
        v-waves @click.native="handleExcel"><svg-icon style="margin-right: 5px" icon-class="excel" />导出Excel</el-button>
        <el-radio-group
          class="filter-item" style="" v-model="listQuery.unclosed" text-color="#67C23A" fill="#67C23A" @change="handleFilter">
          <el-radio :label="null">全选</el-radio>
          <el-radio :label="0" fill="#67C23A">告警已关闭</el-radio>
          <el-radio :label="1">告警未关闭</el-radio>
        </el-radio-group>
      <div class="search-alarmLevel filter-item">
        <span style="margin-right: 10px">告警等级</span>
        <el-rate
          v-model="listQuery.alarmLevel" 
          :colors="alarmLevelOption.colors"
          :low-threshold="1" 
          :high-threshold="3" 
          :max="3"
          :texts="alarmLevelOption.texts"
          :text-color="alarmLevelOption.textColor"
          @change="handleAlarmLevel"></el-rate>
        <span :class="{ 'is-checked': AlarmLevelAll }" @click="handleAlarmLevel(-1)">(&nbsp;选择全部&nbsp;)</span>
      </div>
    </div>
    
    <el-table :data="list" :row-key="rowKey" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="告警名称" width="200px">
        <template slot-scope="scope">
          <el-tag>{{scope.row.alarmName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警代码" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.alarmType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警等级" width="100px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.alarmLevel" icon-class="star" class="meta-item__icon" v-bind:class="scope.row.alarmLevel | alarmLevelClass" :key="n"></svg-icon>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警值" width="100px">
        <template slot-scope="scope">
          <span>{{scope.row.alarmValue}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.alarmBeginTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警结束时间">
        <template slot-scope="scope">
          <span>{{scope.row.alarmEndTime | parseTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警确认描述">
        <template slot-scope="scope">
          <span>{{scope.row.confirmComment ? scope.row.confirmComment : "暂无描述"}}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="设备编码">
        <template slot-scope="scope">
          <span>{{scope.row.sn}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子系统代码">
        <template slot-scope="scope">
          <span>{{scope.row.sourceSystemCode}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { selectAlarmRecord, selectAlarmConfig } from '@index/api/alarm-controller'
import { parseTime, deepClone2 } from '@/utils'
import waves from '@/directive/waves'
import copyUrl from '@/components/Clipboard/copyUrl'
export default {
  name: 'alarmSearch',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: null,
      listQuery: {
        page: 1, // 当前页码
        limit: 10, // 不传参数，默认20
        unclosed: null,
        alarmType: undefined,
        alarmLevel: null,
        alarmStartTimeBegin: null,
        alarmStartTimeEnd: null,
        alarmStopTimeBegin: null,
        alarmStopTimeEnd: null
      },
      alarmTypeList: null,
      alarmTypeListLoading: true,
      alarmStartPeriod: '',
      alarmEndPeriod: '',
      alarmLevelOption: {
        colors: ['#67C23A', '#E6A23C', '#F56C6C'],
        texts: ['正常', '警告', '严重'],
        textColor: '#909399'
      },
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
      filename: '告警查询',
      AlarmLevelAll: true,
      autoWidth: true
    }
  },
  filters: {
    alarmLevelClass(level) {
      return {
        'icon-error': +level === 3,
        'icon-warm': +level === 2,
        'icon-success': +level === 1
      }
    },
    parseTime
  },
  created() {
    this.getList()
    this.getAlarmTpyeList()
  },
  methods: {
    rowKey(row) {
      return row.id
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.alarmLevel === 0) {
        this.listQuery.alarmLevel = null
      }
      const query = deepClone2(this.listQuery)
      selectAlarmRecord(query).then(response => {
        this.list = response.data.content
        // this.list = JSON.stringify(response.data.content)
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    getAlarmTpyeList() {
      this.alarmTypeListLoading = true
      selectAlarmConfig({ limit: 9999 }).then(response => {
        this.alarmTypeList = response.data.content
        this.alarmTypeListLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAlarmLevel(value) {
      if (+value === -1) {
        this.listQuery.alarmLevel = null
        this.AlarmLevelAll = true
      } else {
        this.AlarmLevelAll = false
      }
      this.handleFilter()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleExcel() {
      if (typeof window.external.videoCenter !== 'undefined') {
        const h = this.$createElement
        var self = this
        self.$msgbox({
          title: '提示',
          message: h(copyUrl, { props: { text: window.location.href }}),
          lockScroll: true,
          closeOnClickModal: false,
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }).then(action => {}).catch(() => {})
      } else {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const field = ['id', 'alarmName', 'alarmType', 'alarmLevel', 'alarmValue', 'alarmBeginTime', 'alarmEndTime', 'confirmComment', 'sn', 'sourceSystemCode']
          const field_ZH = ['ID', '告警名称', '告警代码', '告警等级', '告警值', '告警开始时间', '告警结束时间', '告警确认描述', '设备编码', '子系统代码']

          const listQuery = Object.assign({}, this.listQuery, { limit: 999999 })

          selectAlarmRecord(listQuery).then(response => {
            const list = response.data.content
            const data = this.formatJson(field, list)
            excel.export_json_to_excel({
              header: field_ZH,
              data,
              filename: this.filename,
              autoWidth: this.autoWidth
            })
            this.downloadLoading = false
          }, () => { this.downloadLoading = false })
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'alarmBeginTime' || j === 'alarmEndTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  },
  computed: {
    /**
     * 按道理来说，alarmName alarmType应该是一一对应的
     */
    alarmTypeAutoComplete() {
      const { alarmTypeList } = this
      if (!alarmTypeList || alarmTypeList.length <= 0) return []
      const ac = alarmTypeList.map((item) => {
        return { label: item.alarmName, value: item.alarmType, id: item.id }
      })
      ac.splice(0, 0, { label: '全部', value: null, id: '-1' })
      // 去重
      var r = []
      for (var i = 0, l = ac.length; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
          if (ac[i].label === ac[j].label) { j = ++i }
        }
        r.push(ac[i])
      }
      return r
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$ERROR: #F56C6C;
$SUCCESS: #67C23A;
$WARM: #E6A23C;
.inline-timePick {
  display: inline-block;
  margin-bottom: 10px;
  vertical-align: middle;
}
.search-alarmLevel {
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -ms-justify-content: center;
  -webkit-justify-content: center;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-left: 25px;
  vertical-align: middle;
  font-size: 14px;
  line-height: 20px;
  height: 20px;
  span {
    margin-left: 10px;
    color: #777;
    cursor: pointer;
    &:hover {
      color: #409EFF;
    }
    &.is-checked {
      color: #409EFF;
    }
  }
}
.icon-error {
  color: $ERROR !important;
}
.icon-success {
  color: $SUCCESS !important;
}
.icon-warm {
  color: $WARM !important;
}
</style>