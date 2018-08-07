<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="告警类型" v-model="listQuery.alarmType">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :data="table_list" :row-key="rowKey" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="告警名称" width="200px">
        <template slot-scope="scope">
          <el-tag>{{scope.row.alarmName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警类型">
        <template slot-scope="scope">
          <span>{{scope.row.alarmType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="默认图片" width="250px">
        <template slot-scope="scope">
          <span>{{scope.row.defaultPic}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="告警等级">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.alarmLevel" icon-class="star" class="meta-item__icon" v-bind:class="{ 'icon-error': +scope.row.alarmLevel === 3 }" :key="n"></svg-icon>
        </template>
      </el-table-column>

      <el-table-column align="center" label="有效时长">
        <template slot-scope="scope">
          <span>{{scope.row.effectiveTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="显示图标">
        <template slot-scope="scope">
          <svg-icon v-if="scope.row.iconDisplay" :icon-class="scope.row.iconDisplay" class="meta-item__icon"></svg-icon>
          <span v-else>暂无图标</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="联动低点距离">
        <template slot-scope="scope">
          <span>{{scope.row.linkageDistance}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="必须确认">
        <template slot-scope="scope">
          <i :class="scope.row.mustConfirm | handleSwitch"></i>
        </template>
      </el-table-column>

      <el-table-column align="center" label="推送">
        <template slot-scope="scope">
          <i :class="scope.row.alarmPush | handleSwitch"></i>
        </template>
      </el-table-column>

      <el-table-column align="center" label="低点联动">
        <template slot-scope="scope">
          <i :class="scope.row.linkage | handleSwitch"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联动机器人">
        <template slot-scope="scope">
          <i :class="scope.row.linkageRobot | handleSwitch"></i>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModel" width="600px">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left:50px;">
        <el-form-item label="告警名称" prop="alarmName">
          <el-input v-model.trim="temp.alarmName"></el-input>
        </el-form-item>
        <el-form-item label="告警类型" prop="alarmType">
          <el-input v-model.number="temp.alarmType" type="number"></el-input>
        </el-form-item>

        <el-form-item label="默认图片" prop="defaultPic">
          <el-input v-model.trim="temp.defaultPic"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="10">
            <el-form-item label="告警等级" prop="alarmLevel">
              <el-select class="filter-item" v-model="temp.alarmLevel" placeholder="请选择">
                <el-option v-for="item in alarmLevelOption" :key="item.key" :label="item.label" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-form-item label="告警图标" prop="iconDisplay"> 
              <el-select class="filter-item" v-model="temp.iconDisplay" placeholder="请选择">
                <el-option v-for="item in alarmIconOption" :key="item.key" :label="item.iconClass" :value="item.key">
                  <svg-icon :icon-class="item.iconClass"></svg-icon>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="有效时长" prop="effectiveTime">
          <el-input v-model.number="temp.effectiveTime" type="number" placeholder="单位为秒（s）"></el-input>
        </el-form-item>

         <el-form-item label="联动低点距离" prop="linkageDistance">
          <el-input v-model.trim="temp.linkageDistance"></el-input>
        </el-form-item>

          <p>温馨提示：&nbsp;&nbsp;<font class="icon-success">绿色</font>&nbsp;代表<q>启动</q>，<font class="icon-default">浅灰色</font>&nbsp;代表<q>关闭</q></p>

        <el-row>
          <el-col :span="12">
            <el-form-item label="必须确认" prop="mustConfirm">
              <el-switch v-model="temp.mustConfirm" 
              active-color="#13ce66"
              :active-value="switchValue.activeValue"
              :inactive-value="switchValue.inactiveValue"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推送" prop="alarmPush">
              <el-switch v-model="temp.alarmPush" 
              active-color="#13ce66"
              :active-value="switchValue.activeValue"
              :inactive-value="switchValue.inactiveValue"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否低点联动" prop="linkage">
              <el-switch 
              v-model="temp.linkage" 
              active-color="#13ce66"
              :active-value="switchValue.activeValue"
              :inactive-value=switchValue.inactiveValue></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否联动机器人" label-width="110px" prop="linkageRobot">
              <el-switch 
              v-model="temp.linkageRobot" 
              active-color="#13ce66"
              :active-value="switchValue.activeValue"
              :inactive-value="switchValue.inactiveValue"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">创建</el-button>
        <el-button v-else type="primary" @click="updateData">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectAlarmConfig, saveAlarmConfig, deleteAlarmConfig } from '@/api/alarm-controller'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'alarmConfig',
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
        limit: 10,
        alarmType: undefined
      },
      temp: {
        alarmLevel: null,
        alarmName: null,
        alarmPush: 0,
        alarmType: null,
        defaultPic: '',
        effectiveTime: null,
        iconDisplay: null,
        linkage: 0,
        linkageDistance: null,
        linkageRobot: 0,
        mustConfirm: 0
      },
      closeOnClickModel: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      alarmLevelOption: [
        { key: 1, label: '1' },
        { key: 2, label: '2' },
        { key: 3, label: '3' }
      ],
      alarmIconOption: [
        { key: 1, iconClass: 'alarm' },
        { key: 2, iconClass: 'component' },
        { key: 3, iconClass: 'chart' }
      ],
      switchValue: {
        activeValue: 1,
        inactiveValue: 0
      },
      rules: {
        alarmLevel: [{ required: true, message: '告警等级不为空', trigger: 'blur' }],
        alarmType: [{ required: true, message: '告警类型不能为空', trigger: 'blur' }],
        effectiveTime: [{ required: true, message: '有效时长不能为空', trigger: 'blur' }]
      }
    }
  },
  filters: {
    handleSwitch(bool) {
      if (+bool === 1) {
        return 'el-icon-success icon-success'
      }
      return 'el-icon-error icon-error'
    }
  }, // can not use this
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      selectAlarmConfig(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        alarmLevel: null,
        alarmName: null,
        alarmPush: 0,
        alarmType: null,
        defaultPic: '',
        effectiveTime: null,
        iconDisplay: null,
        linkage: 0,
        linkageDistance: null,
        linkageRobot: 0,
        mustConfirm: 0
      }
    },
    rowKey(row) {
      return row.id
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveAlarmConfig(this.temp).then((res) => {
            this.$set(this.temp, 'id', res.data.id)
            this.list.unshift(this.temp)
            this.total += 1
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 1500
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = this.handleIconDispaly(Object.assign({}, row), 'reverse') // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          saveAlarmConfig(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 1500
            })
          })
        }
      })
    },
    handleDelete(...params) {
      const index = params[0]
      const id = params[1].id
      deleteAlarmConfig({ id }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleIconDispaly(obj, type) {
      this.alarmIconOption.find((item) => {
        if (type === 'reverse') {
          if (item.iconClass === obj.iconDisplay) {
            obj.iconDisplay = +item.key
            return true
          }
        } else {
          if (+item.key === +obj.iconDisplay) {
            obj.iconDisplay = item.iconClass
            return true
          }
        }
        return false
      })
      return obj
    }
  },
  computed: {
    table_list: function() {
      if (Array.isArray(this.list) && this.list.length > 0) {
        return this.list.map((key) => {
          const obj = Object.assign({}, key)
          return this.handleIconDispaly(obj)
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-error {
    color: #F56C6C !important;
  }
  .icon-success {
    color: #67C23A !important;
  }
  .icon-default {
    color: #909399;
  }
</style>