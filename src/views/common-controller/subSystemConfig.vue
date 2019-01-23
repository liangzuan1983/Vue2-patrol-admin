<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="子系统名称" v-model="listQuery.systemName">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">添加</el-button>
    </div>

    <el-table :data="handleList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="子系统名称">
        <template slot-scope="scope">
          <span>{{scope.row.systemName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子系统代码">
        <template slot-scope="scope">
          <span>{{scope.row.systemCode}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子系统账号">
        <template slot-scope="scope">
          <span>{{scope.row.systemAccount}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子系统密码">
        <template slot-scope="scope">
          <span>{{scope.row.systemPassword}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子系统IP">
        <template slot-scope="scope">
          <span>{{scope.row.systemIp}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="子系统端口">
        <template slot-scope="scope">
          <span>{{scope.row.systemPort}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column> -->

      <!-- <el-table-column min-width="300px" label="Title">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input class="edit-input" size="small" v-model="scope.row.title"></el-input>
            <el-button class='cancel-btn' size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">cancel</el-button>
          </template>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="操作" fixed="right">
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
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="子系统名称" prop="systemName">
          <el-input v-model.trim="temp.systemName"></el-input>
        </el-form-item>
        <el-form-item label="子系统代码" prop="systemCode">
          <el-input v-model.trim="temp.systemCode"></el-input>
        </el-form-item>
        <el-form-item label="子系统账号" prop="systemAccount">
          <el-input v-model.trim="temp.systemAccount"></el-input>
        </el-form-item>
        <el-form-item label="子系统密码" prop="systemPassword">
          <el-input v-model.trim="temp.systemPassword"></el-input>
        </el-form-item>
        <el-form-item label="子系统IP" prop="systemIp">
          <el-input v-model.trim="temp.systemIp"></el-input>
        </el-form-item>
        <el-form-item label="子系统端口" prop="systemPort">
          <el-input v-model.number="temp.systemPort"></el-input>
        </el-form-item>
        
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
import { selectSubSystemConfig, saveSubSystemConfig, deleteSubSystemConfig } from '@/api/common-controller'
import waves from '@/directive/waves' // 水波纹指令
import { validateIP } from '@/utils/validate'

export default {
  name: 'subSystemConfig',
  directives: {
    waves
  },
  data() {
    var _validateIP = (rule, value, callback) => {
      if (!validateIP(value)) {
        callback(new Error('输入正确的IP格式'))
      }
      callback()
    }

    var _validatePort = (rule, value, callback) => {
      if (+value > 65535) {
        callback(new Error('端口号不能超出65535'))
      }
      callback()
    }

    return {
      list: null,
      listLoading: true,
      total: null,
      listQuery: {
        page: 1, // 当前页码
        limit: 10,
        systemName: undefined
      },
      temp: {
        systemName: '',
        systemCode: '',
        systemAccount: '',
        systemPassword: '',
        systemIp: '',
        systemPort: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      closeOnClickModel: false,
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        systemName: [{ required: true, message: '子系统名称不能为空', trigger: 'blur' }],
        systemCode: [{ required: true, message: '子系统代码不能为空', trigger: 'blur' }],
        systemAccount: [{ required: true, message: '子系统账号不能为空', trigger: 'blur' }],
        systemPassword: [{ required: true, message: '子系统密码不能为空', trigger: 'blur' }],
        systemIp: [
          { required: true, message: '子系统IP不能为空', trigger: 'blur' },
          { validator: _validateIP, trigger: 'blur' }],
        systemPort: [
          { required: true, message: '子系统端口不能为空', trigger: 'blur' },
          { type: 'number', message: '只能为数字', trigger: 'blur' },
          { validator: _validatePort, trigger: 'blur' }]
      }
    }
  },
  filters: {},
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      selectSubSystemConfig(this.listQuery).then(response => {
        this.list = response.data.content
        this.total = response.data.totalElements
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        systemName: '',
        systemCode: '',
        systemAccount: '',
        systemPassword: '',
        systemIp: '',
        systemPort: ''
      }
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
          saveSubSystemConfig(this.temp).then((res) => {
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
      this.temp = Object.assign({}, row) // copy obj
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
          saveSubSystemConfig(tempData).then(() => {
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
      deleteSubSystemConfig({ id }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
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
  },
  computed: {
    handleList() {
      if (!this.list) return
      for (const i of this.list) {
        i.systemPort = +i.systemPort
      }
      return this.list
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>