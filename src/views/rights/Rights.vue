<template>
    <el-card class="rightsCard">
      <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
      <template>
        <el-table
          :data="rightsList"
          border
          style="width: 600px">
          <el-table-column
            type="index"
          ></el-table-column>
          <el-table-column
            prop="authName"
            label="权限名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="path"
            label="路径"
            width="180">
          </el-table-column>
          <el-table-column
            label="层级">
            <!--自定义模板 挂载scope当前行信息-->
            <template slot-scope="scope">
              <span v-if="scope.row.level === '0'">一级</span>
              <span v-else-if="scope.row.level === '1'">二级</span>
              <span v-else-if="scope.row.level === '2'">三级</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
</template>

<script>
export default {
  name: 'Rights',
  created () {
    this.handleLoadData()
  },
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async handleLoadData () {
      const response = await this.$axios.get('rights/list')
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        this.rightsList = response.data.data
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>

<style scoped>
.rightsCard{
  height: 100%;
  overflow: auto;
}
</style>
