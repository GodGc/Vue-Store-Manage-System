<template>
  <el-container class="home-wrap">
    <el-header class="home-header" height="60px">
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png" alt="logo-img">
        </el-col>
        <el-col :span="18">
          <h2>Vue-Store Manage System</h2>
        </el-col>
        <el-col :span="2">
          <el-button @click="handleLogout" type="primary" icon="el-icon-close">Logout</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="home-aside" width="auto">
        <el-radio-group v-model="isCollapse" style="margin-bottom: 12px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>
        <el-menu
          default-active="/users"
          unique-opened
          router
          class="el-menu"
          background-color="#545c64"
          text-color="#fff"
          :collapse="isCollapse"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users"><i class="el-icon-menu"></i>用户列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles"><i class="el-icon-menu"></i>角色列表</el-menu-item>
            <el-menu-item index="/rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="/goods"><i class="el-icon-menu"></i>商品列表</el-menu-item>
            <el-menu-item index="/list"><i class="el-icon-menu"></i>分类数据</el-menu-item>
            <el-menu-item index="/goodslist"><i class="el-icon-menu"></i>商品分类</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/orders"><i class="el-icon-menu"></i>订单列表</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="/dataforms"><i class="el-icon-menu"></i>数据报表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="home-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 进行登录权限限制
  beforeCreate () {
    const token = sessionStorage.getItem('token')
    if (!token) {
      this.$message.warning('请先登录')
      this.$router.push('/login')
    }
  },
  name: 'Home',
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleLogout () {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.home-wrap{
  height: 100%;
}
.home-wrap .home-header{
  background-color: #28477c;
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.home-wrap .home-header img{
  height: 60px;
}
.home-wrap .home-main{
  background-color: #dceaf9;
  overflow: hidden;
}
.home-wrap .home-aside{
  overflow: hidden;
  background-color: #545c64;
}
.el-menu{
  border: 0;
}
.el-menu:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
</style>
