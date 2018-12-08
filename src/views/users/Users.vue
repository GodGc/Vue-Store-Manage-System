<template>
  <el-card class="users-card">
    <my-breadcrumb level1="用户管理" level2="用户列表"></my-breadcrumb>
    <el-row>
      <el-col :span="24">
        <el-input
          class="searchIpt"
          placeholder="请输入内容"
          v-model="query"
          clearable
          @clear="handleClear">
        </el-input>
        <el-button icon="el-icon-search" @click="handleSearchUser"></el-button>
        <el-button type="primary" plain @click="AddDialogFormVisible = true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        stripe
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="150">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column
          label="用户状态"
          width="80">
          <template slot-scope="scope">
            <!--scope 是一个对象,{{scope.row}}的内容是当前这一行的所有信息,
            数据来源是:data="tableData"中的数据-->
            <el-switch
              @change="handleUserStatus(scope.row.id, scope.row.mg_state)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEditDialog(scope.row)" size="mini" plain type="primary" icon="el-icon-edit"></el-button>
            <el-button @click="handleEditRole(scope.row)" size="mini" plain type="success" icon="el-icon-check"></el-button>
            <el-button @click="handleDelConfirm(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        :current-page= pagenum
        :page-sizes="[2,4,6]"
        :page-size= pageSize
        :page-count = "7"
        @current-change="handleCuurentChange"
        @size-change="handleSizeChange"
        layout="total, prev, sizes, pager, next, jumper"
        :total= count>
      </el-pagination>
      <!--添加用户对话框-->
      <el-dialog @close="handleCancleAddUser" title="添加用户" :visible.sync="AddDialogFormVisible">
        <el-form :model="form" :rules="rules" ref="addform">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model.number="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddUser">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑用户对话框-->
      <el-dialog @close="handleEditDialogClose" title="编辑用户" :visible.sync="editDialogFormVisible">
        <el-form :model="form" :rules="rules" ref="editform">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input v-model="form.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model.number="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditUser">确 定</el-button>
        </div>
      </el-dialog>
      <!--分配角色对话框-->
      <el-dialog title="分配角色" :visible.sync="RoleDialogFormVisible">
        <el-form>
          <el-form-item label="用户名" :label-width="formLabelWidth">
            {{ currentUsername }}
          </el-form-item>
          <el-form-item label="选择角色" :label-width="formLabelWidth">
              <el-select v-model="currentRoleId">
              <el-option :value="-1" label="请选择" disabled></el-option>
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="RoleDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleChangeRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
  </el-card>
</template>

<script>
export default {
  created () {
    this.handleLoadData(this.pagenum, this.pageSize, this.query)
  },
  name: 'Users',
  data () {
    return {
      query: '',
      tableData: [],
      pagenum: 1,
      pageSize: 4,
      count: 0,
      AddDialogFormVisible: false,
      editDialogFormVisible: false,
      RoleDialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
        ],
        mobile: [
          {type: 'number', message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        email: [
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ]
      },
      // 分配角色 - 当前用户名/当前用户ID/当前用户角色ID
      currentUsername: '',
      currentUserID: -1,
      currentRoleId: -1,
      roleList: []
    }
  },
  methods: {
    async handleLoadData (pagenum, pageSize, query) {
      var response = await this.$axios
        .get('/users', {
          params: {
            pagenum: pagenum, pagesize: pageSize, query: query
          }})
      // response的形式是: { data { users: [] }, meta: { status } }
      // 使用对象解构赋值的方式声明变量
      var { meta: {status, msg} } = response.data
      if (status === 200) {
        this.tableData = response.data.data.users
        this.count = response.data.data.total
      } else {
        console.log(msg)
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.handleLoadData(this.pagenum, this.pageSize)
      console.log(`每页 ${val} 条`)
    },
    handleCuurentChange (val) {
      this.pagenum = val
      this.handleLoadData(this.pagenum, this.pageSize)
      console.log(`当前页: ${val}`)
    },
    handleSearchUser () {
      this.handleLoadData(this.pagenum, this.pageSize, this.query)
    },
    handleClear () {
      this.handleLoadData(this.pagenum, this.pageSize, this.query)
    },
    async handleAddUser () {
      this.$refs.addform.validate(async (valid) => {
        if (valid) {
          const response = await this.$axios.post('/users', this.form)
          // 判断是否添加成功
          const {data: {meta: {status, msg}}} = response
          if (status === 201) {
            this.$message.success(msg)
            // 添加成功重置表单
            this.$refs.addform.resetFields()
            this.AddDialogFormVisible = false
            // 添加成功 成功渲染一下数据
            this.handleLoadData(this.pagenum, this.pageSize, this.query)
          } else {
            this.$message.error(msg)
          }
        } else {
          this.$message.error('输入有误')
          return false
        }
      })
    },
    handleCancleAddUser () {
      for (var key in this.form) {
        this.form[key] = ''
      }
    },
    handleEditDialog (user) {
      this.editDialogFormVisible = true
      this.form.username = user.username
      this.form.mobile = user.mobile
      this.form.email = user.email
      this.form.id = user.id
    },
    async handleEditUser () {
      const response = await this.$axios.put(`/users/${this.form.id}`, this.form)
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        this.$message.success(msg)
        this.editDialogFormVisible = false
        // 重新加载数据
        this.handleLoadData(this.pagenum, this.pageSize)
        // 添加成功后清空表单
        for (var key in this.form) {
          this.form[key] = ''
        }
      } else {
        this.$message.warning(msg)
      }
    },
    handleEditDialogClose () {
      for (var key in this.form) {
        this.form[key] = ''
      }
    },
    handleDelConfirm (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const response = await this.$axios.delete(`users/${id}`)
        const {meta: {status, msg}} = response.data
        if (status === 200) {
          // 加一层判断 处理最后一页的最后一个数据删除后页码未及时响应
          if (this.tableData.length === 1 && this.pageSize !== 1) {
            this.pagenum--
          }
          this.handleLoadData(this.pagenum, this.pageSize)
          this.$message({
            type: 'success',
            message: msg
          })
        } else {
          this.$message.error(msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async handleUserStatus (id, type) {
      // console.log(id, status)
      const response = await this.$axios.put(`users/${id}/state/${type}`)
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    async handleEditRole (user) {
      this.RoleDialogFormVisible = true
      // 获取用户名和ID
      this.currentUsername = user.username
      this.currentUserID = user.id
      // 获取所有的角色列表
      const response = await this.$axios.get('/roles')
      this.roleList = response.data.data
      // 获取当前用户的角色ID
      const response1 = await this.$axios.get(`/users/${this.currentUserID}`)
      // 如果用户角色ID未分配则为-1 => 对应'请选择'项
      this.currentRoleId = response1.data.data.rid
    },
    async handleChangeRole () {
      const response = await this.$axios.put(`/users/${this.currentUserID}/role`, {rid: this.currentRoleId})
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        this.RoleDialogFormVisible = false
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style scoped>
.users-card{
  height: 100%;
  overflow: auto;
}
.el-breadcrumb{
  margin-bottom: 10px;
}
.searchIpt {
  display: inline-block;
  width: 300px;
}
</style>
