<template>
  <div class="app-container">
    <!--    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />-->
    <div class="left-block">

      <div class="sidebar-action">
        <el-button icon="el-icon-plus" @click="toAddDepartmentPage">新增部门</el-button>
        <el-button icon="el-icon-delete" @click="deleteDepartment">删除部门</el-button>
      </div>

      <el-tree
        ref="tree2"
        :data="data1"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        default-expand-all
      />
    </div>

    <div class="right-block">
      <div class="sidebar-action">
        <el-button icon="el-icon-plus" @click="addAndEditEmployee()">新增人员</el-button>
      </div>
      <el-table :data="tableData" border>
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="phone" label="手机号码" width="180" />
        <el-table-column prop="age" label="年龄" width="180" />
        <el-table-column prop="state" label="状态" width="180" />
        <el-table-column prop="did" label="所属部门" width="180" />
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click.native.prevent="addAndEditEmployee(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click.native.prevent="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-size="size"
        :total="total"
        @current-change="currentChange"
      />
      <div>
        <el-dialog class="employee" :title="filterText" :visible.sync="dialogFormVisible">
          <el-form ref="formRef" :model="tableData">
            <el-form-item label="名字" :label-width="formLabelWidth">
              <el-input v-model="tableData.username"/>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="tableData.password" />
            </el-form-item>
            <el-form-item label="email" :label-width="formLabelWidth">
              <el-input v-model="tableData.email"/>
            </el-form-item>
            <el-form-item label="phone" :label-width="formLabelWidth">
              <el-input v-model="tableData.phone"/>
            </el-form-item>
            <el-form-item label="年龄" :label-width="formLabelWidth">
              <el-input v-model="tableData.age" />
            </el-form-item>
            <el-form-item label="所属部门" :label-width="formLabelWidth">
              <el-select v-model="options.id" clearable placeholder="请选择" @focus="getChoiceList">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select v-model="tableData.state" placeholder="请选择状态">
                <el-option label="在职" value="0" />
                <el-option label="离职" value="1" />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="Confirm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteDepartment, getExChoiceListApi, list } from '@/api/department'
import { addEmployee, deleteEmployee, tableData, updateEmployee } from '@/api/employee'

export default {
  data() {
    return {
      options: [],
      filterText: '',
      data1: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableData: [],
      dialogFormVisible: false,
      ifMaterialEdit: 0, // 0表示编辑，1表示新增
      formLabelWidth: '120px'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  }, created() {
    this.treeData()
    this.fetchData()
    this.getChoiceList()
  },

  methods: {
    getChoiceList() {
      this.listLoading = true
      getExChoiceListApi().then(Response => {
        this.data = Response.data
        console.log(this.data)
        this.options = this.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    treeData() {
      this.listLoading = true
      list().then(Response => {
        this.data = Response.data
        this.data1 = this.data
      })
    },

    fetchData() {
      const params = {
        page: this.page,
        size: this.size
      }
      this.listLoading = true
      tableData(params).then(response => {
        this.data = response.data
        console.log(this.data)
        this.tableData = this.data
      })
    },

    currentChange(page) {
      this.page = page
      this.fetchData()
    },
    toAddDepartmentPage() {
      const r = this.$refs.tree2.getCurrentNode()
      console.log(r)
      if (r) {
        this.$router.push({ name: 'Create', params: { data: r }})
      } else {
        const d1 = this.data1[0]
        this.$router.push({ name: 'Create', params: { data: d1 }})
      }
    },

    deleteDepartment() {
      const currentNode = this.$refs.tree2.getCurrentNode()
      if (!currentNode) {
        this.$message.warning('请选择要删除的部门')
        return
      }
      const departmentId = currentNode.id
      this.$confirm('确认删除该部门吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDepartment({ id: departmentId })
            .then(() => {
              // 处理删除成功的情况
              this.treeData()
              this.fetchData()
              this.$message.success('部门删除成功')
            })
            .catch(error => {
              // 处理删除失败的情况
              console.error('删除部门失败', error)
              this.$message.error('部门删除失败')
            })
        })
    },

    addAndEditEmployee(row) {
      if (row) {
        this.ifMaterialEdit = 0
        this.dialogFormVisible = true
        this.filterText = '修改人员信息'
        this.tableData = row
      } else {
        this.ifMaterialEdit = 1
        this.dialogFormVisible = true
        this.filterText = '新增人员'
        this.tableData = {}
      }
    },
    Confirm() {
      console.log(this.tableData)
      this.getChoiceList()
      const requestData = {
        id: this.tableData.id,
        username: this.tableData.username,
        password: this.tableData.password,
        email: this.tableData.email,
        phone: this.tableData.phone,
        state: this.tableData.state,
        age: this.tableData.age,
        did: this.options.id,
        department: {
          id: this.options.id,
          name: this.options.name
        }
      }
      if (this.ifMaterialEdit === 0) {
        // Call the API to update the employee data
        updateEmployee(requestData).then(response => {
          if (response['resultCode'] === 200) {
            this.dialogFormVisible = false
            this.fetchData()
            this.$message.success('人员信息修改成功')
          } else {
            this.$message.error(response['message'])
          }
        }).catch(error => {
          console.error('人员信息修改失败', error)
          this.$message.error('人员信息修改失败')
        })
      } else if (this.ifMaterialEdit === 1) {
        addEmployee(requestData).then(response => {
          console.log('requestData:', requestData)
          if (response['resultCode'] === 200) {
            this.dialogFormVisible = false
            this.$router.push({ path: '/department/index' })
          } else {
            this.$message(response['message'])
          }
        }).catch(error => {
          console.error('人员添加失败', error)
          this.$message.error('人员添加失败')
        })
      }
    },
    handleDelete(row) {
      const id = row.id
      deleteEmployee({ id: id }).then(response => {
        console.log('id' + id)
        if (response['resultCode'] === 200) {
          this.fetchData()
          this.$router.push({ path: '/department/index' })
        } else {
          this.$message(response['message'])
        }
      }).catch(error => {
        console.error('人员删除失败', error)
        this.$message.error('人员删除失败')
      })
    }
  }
}
</script>

<style scoped>
.sidebar-action {
  margin-bottom: 16px;
  margin-top: 18px;
}

.app-container {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  font-size: 14px;
  padding-right: 8px;
}

.left-block {
  width: 300px;
  flex-grow: 1;
  margin-left: 32px;
  margin-right: 32px;
  border-right: 2px solid gainsboro;
}

.right-block {
  flex-grow: 2;
}
</style>

