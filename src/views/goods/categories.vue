<template>
    <el-card>
      <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
      <el-button @click="handleAdd" type="primary" plain>添加分类</el-button>
      <el-table
        stripe
        border
        v-loading="loading"
        :data="catList"
        style="width: 100%">
        <!--<el-table-column-->
          <!--prop="cat_name"-->
          <!--label="分类名称"-->
          <!--width="300">-->
        <!--</el-table-column>-->
        <ele-table-tree-column
          treeKey="cat_id"
          levelKey="cat_level"
          parentKey="cat_pid"
          childKey="children"
          prop="cat_name"
          label="分类名称"
          width="300">
        </ele-table-tree-column>
        <el-table-column
          label="级别"
          width="300">
          <template
            slot-scope="scope">
            <span v-if="scope.row.cat_level === 0">一级</span>
            <span v-else-if="scope.row.cat_level === 1">二级</span>
            <span v-else-if="scope.row.cat_level === 2">三级</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_delete"
          label="是否有效"
          width="180">
          <template
            slot-scope="scope">
            <span v-if="scope.row.cat_delete">无效</span>
            <span v-else>有效</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" plain type="primary" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 7, 9]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!--添加分类对话框-->
      <el-dialog title="添加分类" :visible.sync="AdddialogFormVisible">
        <el-form :model="form">
          <el-form-item label="分类名称" label-width="100px">
            <el-input v-model="form.cat_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类列表" label-width="100px">
            <el-cascader
              clearable
              placeholder="默认添加一级分类"
              change-on-select
              expand-trigger="hover"
              :options="options"
              :props="defaultProps"
              v-model="currtIds">
            </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AdddialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddCate">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</template>

<script>
// 引入第三方tree grid组件
import elementTreegrid from 'element-tree-grid'
export default {
  created () {
    this.handleLoadData()
  },
  name: 'categories',
  data () {
    return {
      catList: [],
      loading: true,
      pagenum: 1,
      pagesize: 5,
      total: 0,
      // 添加分类使用的数据
      AdddialogFormVisible: false,
      // 用于添加分类参数
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: 0
      },
      // 数据源
      options: [],
      // 传递给组件的值
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 当前选中的ID ,双向绑定的
      currtIds: []
    }
  },
  methods: {
    async handleLoadData () {
      this.loading = true
      const response = await this.$axios.get('/categories', {
        params: {type: [1, 2, 3], pagenum: this.pagenum, pagesize: this.pagesize}
      })
      this.loading = false
      const {meta: {status, msg}} = response.data
      if (status === 200) {
        this.catList = response.data.data.result
        this.total = response.data.data.total
      } else {
        this.$message.error(msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleLoadData()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.handleLoadData()
    },
    async handleAdd () {
      this.AdddialogFormVisible = true
      const response = await this.$axios.get('/categories/?type=2')
      this.options = response.data.data
    },
    async handleAddCate () {
      // 处理发送参数 cat_pid /cat_name / cat_level
      // cat_name 不用处理 => 双向绑定
      // cat_pid 要添加到的父分类id,如果是1级菜单则为0
      if (this.currtIds.length === 0) {
        this.form.cat_pid = 0
      } else {
        this.form.cat_pid = this.currtIds[this.currtIds.length - 1]
      }
      // cat_level 分别有 0,1,2 三个级别 分别对应了this.currtIds的长度
      this.form.cat_level = this.currtIds.length
      const response = await this.$axios.post('/categories', this.form)
      const {meta: {status, msg}} = response.data
      if (status === 201) {
        this.AdddialogFormVisible = false
        this.$message.success(msg)
        this.handleLoadData()
      } else {
        this.$message.warning(msg)
      }
    }
  },
  // 注册局部组件
  components: {
    'ele-table-tree-column': elementTreegrid
  }
}
</script>

<style scoped>

</style>
