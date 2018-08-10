<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="inline-timePick">
        <span style="margin-right: 10px">开始时间段</span>
        <el-date-picker
          style="margin: 0 15px"
          v-model="alarmStartPeriod"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="center">
        </el-date-picker>
      </div>

      <div class="inline-timePick">
        <span style="margin-right: 10px">结束时间段</span>
        <el-date-picker
          style="margin: 0 15px"
          v-model="alarmEndPeriod"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="center">
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

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <div class="filter-container" style="padding-bottom: 35px">
        <el-radio-group
          style="" v-model="listQuery.unclosed" text-color="#67C23A" fill="#67C23A" @change="handleFilter">
          <el-radio :label="null">全选</el-radio>
          <el-radio :label="0" fill="#67C23A">告警已关闭</el-radio>
          <el-radio :label="1">告警未关闭</el-radio>
        </el-radio-group>
      <div class="search-alarmLevel">
        <span style="margin-right: 10px">告警等级</span>
        <el-rate 
          v-model="listQuery.alarmLevel" 
          :colors="alarmLevelOption.colors"
          :low-threshold="1" 
          :high-threshold="3" 
          :max='3'
          :texts="alarmLevelOption.texts"
          :text-color="alarmLevelOption.textColor"
          @change="handleFilter"></el-rate>
      </div>
    </div>
    
    <el-table :data="list" :row-key="rowKey" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="告警名称" width="200px">
        <template slot-scope="scope">
          <el-tag>{{scope.row.alarmName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警代码" width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.alarmType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警等级" width="120px">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.alarmLevel" icon-class="star" class="meta-item__icon" v-bind:class="scope.row.alarmLevel | alarmLevelClass" :key="n"></svg-icon>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警温度" width="120px">
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

      <el-table-column align="center" label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" @click="handleDelete(scope.$index, scope.row)" size="small" icon="el-icon-delete">删除</el-button>
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
import { selectAlarm, selectAlarmConfig } from '@/api/alarm-controller'
import waves from '@/directive/waves'
import { parseTime } from '@/utils'
export default {
  name: 'alarmSearch',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      alarmTypeList: null,
      listLoading: true,
      alarmTypeListLoading: true,
      total: null,
      alarmStartPeriod: '',
      alarmEndPeriod: '',
      listQuery: {
        page: 1, // 当前页码
        limit: 20,
        unclosed: null,
        alarmType: undefined,
        alarmLevel: 1,
        alarmStartTimeBegin: null,
        alarmStartTimeEnd: null,
        alarmStopTimeBegin: null,
        alarmStopTimeEnd: null
      },
      alarmLevelOption: {
        colors: ['#67C23A', '#E6A23C', '#F56C6C'],
        texts: ['正常', '警告', '严重'],
        textColor: '#909399'
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
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
      selectAlarm(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    getAlarmTpyeList() {
      this.alarmTypeListLoading = true
      selectAlarmConfig().then(response => {
        this.alarmTypeList = response.data.content
        this.alarmTypeListLoading = false
      })
    },
    handleFilter() {
      const { alarmStartPeriod, alarmEndPeriod, handleTimeFormat } = this
      this.listQuery.page = 1
      handleTimeFormat(alarmStartPeriod, 'start') & handleTimeFormat(alarmEndPeriod, 'end')
      this.getList()
    },
    handleTimeFormat(time, type) {
      if (Array.isArray(time) && time.length > 0) {
        if (type === 'start') {
          this.listQuery.alarmStartTimeBegin = parseTime(time[0])
          this.listQuery.alarmStartTimeEnd = parseTime(time[1])
        } else {
          this.listQuery.alarmStopTimeBegin = parseTime(time[0])
          this.listQuery.alarmStopTimeEnd = parseTime(time[1])
        }
      }
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  },
  computed: {
    alarmTypeAutoComplete() {
      const { alarmTypeList } = this
      if (!alarmTypeList || alarmTypeList.length <= 0) return []
      const ac = alarmTypeList.map((item) => {
        return { label: item.alarmName, value: item.alarmType, id: item.id }
      })
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