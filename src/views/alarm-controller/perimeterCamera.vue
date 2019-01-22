<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item">
        <el-input placeholder="输入周界名称" v-model.number="listQuery.alarmName" style="width: 200px;"  @keyup.enter.native="handleFilter"/>
      </div>
      <el-button style="margin-left: 10px" class="filter-item" type="primary" size="" v-waves icon="el-icon-search" @click.native="handleFilter">搜索</el-button>
    </div>

    <el-table :data="list" :row-key="rowKey" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="周界ID" width="200px">
        <template slot-scope="scope">
          <el-tag>{{scope.row.id || '暂无'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="周界名称">
        <template slot-scope="scope">
          {{scope.row.alarmName || '暂无'}}
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- Dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="closeOnClickModel" width="750px" top="10vh">
      <el-form ref="dataForm" :inline="true" :model="temp" label-width="100px" label-position="right" style="margin:10px;">
        <el-form-item label="经度" prop="alarmType">
          <el-input v-model.number="temp.longitude" type="number"></el-input>
        </el-form-item>

        <el-form-item label="纬度" prop="alarmType">
          <el-input v-model.number="temp.latitude" type="number"></el-input>
        </el-form-item>

        <!-- presetInfo -->
        <div v-for="(item, index) in temp.cameraPresetInfo" v-bind:key="index">
          <!-- camera -->
          <el-form-item label="告警摄像头"
            :prop="'cameraPresetInfo.' + index + '.cameraId'"
            :rules="{
              required: true, message: '摄像头类型不为空', trigger: 'blur'
            }"
            > 
            <!-- sourceId 摄像头id -->
            <el-select 
              v-model="item.cameraId"
              @change="handleCameraChanged($event, index)"
              placeholder="请选择"
              >
              <el-option v-for="camera in computedCameras" :key="camera.value" :label="camera.label" :value="camera.value"></el-option>
            </el-select>
          </el-form-item>
           <!-- ./camera -->

          <!-- preset -->
          <el-form-item
            label-width="70px" 
            label="预置位"
            :prop="'cameraPresetInfo.' + index + '.preset.presetId'"
            :rules="{
              required: true, message: '预置位不能为空', trigger: 'blur'
            }"
            >
            <!-- 预置位id -->
            <el-select
              v-model="item.preset.presetId"
              filterable
              default-first-option
              placeholder="请选择预置位">
              <el-option
                v-for="item in filterPreset(item.cameraId)"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
           <!-- ./preset -->

           <!-- button -->
           <el-button style="margin-left: 15px" @click="handleInfoDelete(index)">删除</el-button>
        </div>
        <!-- ./presetInfo -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleInfoAdd">添加一项</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary">创建</el-button>
        <el-button v-else type="primary" @click="updateData">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { selectAlarmCameraPresetConfig, selectCameraPreset, updateAlarmCameraPresetConfig } from '@/api/alarm-controller'
import { parseTime } from '@/utils'
import waves from '@/directive/waves'
export default {
  name: 'PerimeterCamera',
  data() {
    return {
      list: null,
      listLoading: true,
      total: null,
      listQuery: {
        page: 1, // 当前页码
        limit: 10,
        alarmName: null
      },
      temp: {
        id: null,
        longitude: null,
        latitude: null,
        cameraPresetInfo: [
          {
            name: null,
            cameraId: null,
            preset: {
              name: null,
              presetId: null
            }
          }
        ]
      },
      closeOnClickModel: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // business
      cameraPresetList: null
    }
  },
  directives: {
    waves
  },
  filters: {
    parseTime
  },
  created() {
    this.getList()
    this.getCameraPreset()
  },
  mounted() {},
  methods: {
    rowKey(row) {
      return row.id
    },
    getList() {
      const that = this
      that.listLoading = true
      return new Promise(function(resolve, reject) {
        selectAlarmCameraPresetConfig(that.listQuery).then(response => {
          that.list = response.data.content
          try {
            that.list.map(item => {
              if (typeof item.cameraPresetInfo === 'string') {
                item.cameraPresetInfo = JSON.parse(item.cameraPresetInfo)
              }
            })
          } catch (err) {
            console.log(err)
          }
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
    },
    handleUpdate(row) {
      this.temp = this._.cloneDeep(row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: null,
        longitude: null,
        latitude: null,
        cameraPresetInfo: [
          {
            name: null,
            cameraId: null,
            preset: {
              name: null,
              presetId: null
            }
          }
        ]
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.cameraPresetInfo.map(item => {
            if (!item.name) {
              item.name = this.getCameraNameById(item.cameraId)
              if (!item.preset.name) {
                item.preset.name = this.getPresetNameByIds(item.cameraId, item.preset.presetId)
              }
            }
          })
          const tempData = this._.cloneDeep(this.temp)
          tempData.cameraPresetInfo = JSON.stringify(tempData.cameraPresetInfo)

          updateAlarmCameraPresetConfig(tempData).then(() => {
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
    getCameraPreset() {
      const that = this
      return new Promise(function(resolve, reject) {
        selectCameraPreset().then(response => {
          that.cameraPresetList = response.data
          resolve()
        })
      })
    },
    /**
     * 根据摄像头ID，筛选对应的预置位
     * @param {Number} sourceId
     * @returns {Array}
     */
    filterPreset(sourceId) {
      if (typeof sourceId === 'undefined') return []
      const { cameraPresetList } = this
      if (!Array.isArray(cameraPresetList)) return []
      let arr = []
      cameraPresetList.some(item => {
        if (item.cameraId === sourceId) {
          try {
            arr = item.preset.map(n => {
              return {
                label: n.presetName,
                value: n.presetId + ''
              }
            })
          } catch (err) {
            console.log(err)
          }
        }
      })
      return arr
    },
    /**
     * 摄像头选中触发事件
     * @param {Number} cameraId
     * @param {Number} index
     */
    handleCameraChanged(cameraId, index) {
      try {
        this.temp.cameraPresetInfo[index].name = null
        this.temp.cameraPresetInfo[index].preset.presetId = null
        this.temp.cameraPresetInfo[index].preset.name = null
      } catch (err) {
        console.log(err)
      }
    },
    /**
     * 根据下标删除对应的 cameraPreset 项
     * @param {Number} index 下标
     */
    handleInfoDelete(index) {
      if (typeof index === 'undefined') return
      const arr = this.temp.cameraPresetInfo
      if (arr[index]) {
        return arr.splice(index, 1)
      }
    },
    /**
     * 添加新的 cameraPreset 项
     */
    handleInfoAdd() {
      const arr = this.temp.cameraPresetInfo

      if (Array.isArray(arr)) {
        arr.push({
          name: null,
          cameraId: null,
          preset: {
            name: null,
            presetId: null
          }
        })
      } else {
        this.$set(this.temp, 'cameraPresetInfo', [])
        this.handleInfoAdd()
      }
    },
    /**
     * 根据 cameraId 获取列表对应的name
     * @param {Number} cameraId
     */
    getCameraNameById(cameraId) {
      const { cameraPresetList } = this
      let name = ''
      try {
        cameraPresetList.some(item => {
          if (item.cameraId === cameraId) {
            name = item.cameraName
            return true
          }
          return false
        })
      } catch (err) {
        console.log(err)
      }

      return name
    },
    /**
     * 根据 cameraId presetId 获取列表对应的name
     * @param {Number} cameraId
     * @param {Number} presetId
     */
    getPresetNameByIds(cameraId, presetId) {
      const { cameraPresetList } = this
      let name = ''
      try {
        cameraPresetList.some(item => {
          if (item.cameraId === cameraId) {
            item.preset.map(m => {
              if (m.presetId === presetId) {
                name = m.presetName
              }
            })
            return true
          }
          return false
        })
      } catch (err) {
        console.log(err)
      }

      return name
    }
  },
  computed: {
    computedCameras() {
      const { cameraPresetList } = this
      if (Array.isArray(cameraPresetList)) {
        return cameraPresetList.map(item => {
          return {
            label: item.cameraName,
            value: item.cameraId + ''
          }
        })
      } else {
        return []
      }
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