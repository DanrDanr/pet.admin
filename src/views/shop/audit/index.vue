<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.$index +1}}
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" align="center" width="280">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店铺地址" width="300" align="center">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="370">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ formatDate(scope.row.registerTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button @click="pass(scope.row)">通过</el-button>
          <el-button @click="refuse(scope.row)">拒绝</el-button>
          <el-button @click="remove(scope.row)">删除</el-button>
          <el-button @click="edit(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      align="right"
      background
      layout="prev, pager, next"
      :page-size="per_page"
      :total="total"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
    />
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
        <el-form :model="Data">
          <el-form-item label="id" :label-width="formLabelWidth">
            <el-input v-model="Data.id" autocomplete="off" />
          </el-form-item>
          <el-form-item label="店铺名" :label-width="formLabelWidth">
            <el-input v-model="Data.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth">
            <el-input v-model="Data.tel" autocomplete="off" />
          </el-form-item>
          <el-form-item label="店铺地址" :label-width="formLabelWidth">
            <el-input v-model="Data.address" autocomplete="off" />
          </el-form-item>
          <el-form-item label="state" :label-width="formLabelWidth">
            <el-input v-model="Data.state" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sure()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { edit, paginationList, pass, refuse, remove } from '@/api/shop'
import { addEmployee } from '@/api/employee'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      currentPage: 1,
      per_page: 2,
      Data: [],
      dialogVisible: false,
      dialogTitle: '',
      ifMaterialEdit: 0, // 0表示编辑，1表示新增
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    formatDate(time) {
      const date = new Date(time)
      return (new Date(date)).toLocaleString()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const params = {
        page: this.currentPage, // 获取当前页码
        pageSize: this.per_page
      }
      console.log(params)
      paginationList(params).then(response => {
        console.log(response)
        if (response['resultCode'] === 200) {
          this.list = response.data.shops
          console.log(this.list)

          // 判断数据的数量是否小于每页显示的数量
          if (this.list.length < params.pageSize) {
            const emptyCount = params.pageSize - this.list.length
            for (let i = 0; i < emptyCount; i++) {
              this.list.push({}) // 添加空数据
            }
          }
          this.listLoading = false
          this.total = response.data.total
        } else {
          this.listLoading = false
          this.list = []
          this.$message('数据请求失败')
        }
      })
    },
    pass(row) {
      console.log(row)
      if (row.state === 2) {
        return this.$message('已拒绝')
      }
      if (row.state === 1) {
        return this.$message('已通过 无需重复申请')
      }
      if (row.state === 0) {
        const requestData = {
          state: 1,
          shop: row
        }
        console.log(requestData)
        pass(requestData).then(response => {
          if (response['resultCode'] === 200) {
            // 通过创建用户
            this.AddEmployee(row)
            this.fetchData()
            this.listLoading = false
          } else {
            this.listLoading = false
            this.$message('请求失败')
          }
        })
      }
    },
    AddEmployee(row) {
      const params = {
        username: row.name,
        email: row.address,
        phone: row.tel,
        state: row.state,
        age: 0,
        did: 1
      }
      console.log(params)
      // 调用添加员工的接口
      addEmployee(params).then(response => {
        if (response['resultCode'] === 200) {
          this.$message('通过成功')
        } else {
          this.$message(response['message'])
        }
      })
    },
    refuse(row) {
      console.log(row)
      if (row.state === 2) {
        return this.$message('已拒绝 无需重复申请')
      }
      if (row.state === 1) {
        return this.$message('已申请通过')
      }
      if (row.state === 0) {
        const requestData = {
          state: 2,
          shop: row
        }
        console.log(requestData)
        refuse(requestData).then(response => {
          if (response['resultCode'] === 200) {
            this.fetchData()
            this.listLoading = false
          } else {
            this.listLoading = false
            this.$message('请求失败')
          }
        })
      }
    },
    remove(row) {
      this.$confirm('确认删除该店铺吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row).then(response => {
          if (response['resultCode'] === 200) {
            this.fetchData()
            this.$message.success('删除成功')
          } else {
            this.$message.error('删除失败')
          }
        })
      })
    },
    edit(row) {
      this.ifMaterialEdit = 0
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.Data = row
    },
    sure() {
      const params = {
        id: this.Data.id,
        name: this.Data.name,
        tel: this.Data.tel,
        address: this.Data.address,
        state: this.Data.state
      }
      console.log(params)
      edit(params).then(response => {
        if (response['resultCode'] === 200) {
          this.dialogVisible = false // 关闭弹窗
          this.$message('修改成功')
          this.fetchData()
        } else {
          this.$message(response['message'])
        }
      })
    }
  }
}
</script>

<style>
.pagination{
  margin-top: 16px;
}
</style>
