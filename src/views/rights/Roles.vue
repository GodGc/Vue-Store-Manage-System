<template>
  <el-card>
    <my-breadcrumb level1="权限管理" level2="角色管理"></my-breadcrumb>
    <el-table
      :data="roleData"
      stripe
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        type="expand">
        <template slot-scope="scope">
          <el-row
            class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id">
            <!--第一列-->
            <el-col :span="4">
              <el-tag
                @close="handleDelRight(scope.row, level1.id)"
                closable>
                {{ level1.authName }}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <!--第二列-->
            <el-col :span="20">
              <!--第二列中再循环生成每一行 每一行再分为2列-->
              <el-row
                v-for="level2 in level1.children"
                :key="level2.id">
                <el-col
                  :span="6">
                  <el-tag
                    @close="handleDelRight(scope.row, level2.id)"
                    type="success"
                    closable>
                    {{ level2.authName }}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    @close="handleDelRight(scope.row, level3.id)"
                    class="level3"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    type="warning">
                    {{ level3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">没有权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>
          <el-button
            @click="handleShowAllRight(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分配权限对话框-->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible">
      <el-tree
        ref="rightTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedList"
        :data="rightData"
        :props="rightProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
              <el-button @click="setRightdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleAddRole">确 定</el-button>
            </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      roleData: [],
      loading: true,
      setRightdialogVisible: false,
      rightData: [],
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      checkedList: [],
      currentRoleId: -1
    }
  },
  created () {
    this.handleLoadData()
  },
  methods: {
    async handleLoadData () {
      const response = await this.$axios.get('/roles')
      this.loading = false
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        this.roleData = response.data.data
      } else {
        this.$message.error(msg)
      }
    },
    async handleDelRight (role, rightId) {
      const response = await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        // 优化: 删除成功后会返回最新的对应角色权限.给那一行的scope.row进行重新赋值
        role.children = response.data.data
        this.$message.success(msg)
      } else {
        this.$message.error(msg)
      }
    },
    // 获取所有权限列表 和 默认选中选项
    async handleShowAllRight (currentRole) {
      this.currentRoleId = currentRole.id
      // 先清空选中列表
      this.checkedList = []
      this.setRightdialogVisible = true
      // 获取所有权限列表
      const response = await this.$axios.get('/rights/tree')
      this.rightData = response.data.data
      console.log(this.rightData)
      // 处理默认选中 => 只需要查找最底层权限即可 遍历
      currentRole.children.forEach((level1) => {
        level1.children.forEach((level2) => {
          level2.children.forEach((level3) => {
            this.checkedList.push(level3.id)
          })
        })
      })
    },
    // 角色授权
    async handleAddRole () {
      // 获取选中和半选 选项
      const checked = this.$refs.rightTree.getCheckedKeys()
      const halfChecked = this.$refs.rightTree.getHalfCheckedKeys()
      // const arr = checked.concat(halfChecked)
      // ES6 合并数组方法
      const arr = [...checked, ...halfChecked]
      const response = await this.$axios.post(`roles/${this.currentRoleId}/rights`, {rids: [arr.join(',')]})
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        this.setRightdialogVisible = false
        this.$message.success(msg)
        // 重新加载数据
        this.handleLoadData()
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style scoped>
  .level1 {
    margin-bottom: 10px;
  }
  .level3 {
    margin-right: 8px;
    margin-bottom: 8px;
  }
</style>
