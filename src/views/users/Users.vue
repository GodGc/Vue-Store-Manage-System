<template>
  <el-card class="users-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col :span="24">
        <el-input
          class="searchIpt"
          placeholder="请输入内容"
          v-model="usersSearch"
          clearable>
        </el-input>
        <el-button icon="el-icon-search"></el-button>
        <el-button type="primary" plain>添加用户</el-button>
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
          width="180">
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
          width="100">
          <template slot-scope="scope">
            <!--scope 是一个对象,{{scope.row}}的内容是当前这一列的所有信息,数据来源是:data="tableData"中的数据-->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" plain type="success" icon="el-icon-check"></el-button>
            <el-button size="mini" plain type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-card>
</template>

<script>
export default {
  created () {
    this.handleLoadData()
  },
  name: 'Users',
  data () {
    return {
      usersSearch: '',
      tableData: []
    }
  },
  methods: {
    async handleLoadData () {
      // 配置axios请求是的全局请求头
      this.$axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
      var response = await this.$axios
        .get('/users', {
          params: {
            pagenum: 1, pagesize: 10
          }})
      // response的形式是: { data { users: [] }, meta: { status } }
      // 使用对象解构赋值的方式声明变量
      var { meta: {status, msg} } = response.data
      if (status === 200) {
        this.tableData = response.data.data.users
      } else {
        console.log(msg)
      }
    }
  }
}
</script>

<style scoped>
.users-card{
  height: 100%;
}
.el-breadcrumb{
  height: 40px;
  line-height: 40px;
  font-size: 16px;
}

.searchIpt {
  display: inline-block;
  width: 300px;
}
</style>
