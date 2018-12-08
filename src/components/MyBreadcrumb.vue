<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadCrumbRight">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'MyBreadcrumb',
  // 这个子组件接收父组件传入的值
  props: ['level1', 'level2']
}
</script>

<style scoped>
.breadCrumbRight{
  margin-bottom: 10px;
}
</style>
