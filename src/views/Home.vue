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
          unique-opened
          router
          class="el-menu"
          background-color="#545c64"
          text-color="#fff"
          :collapse="isCollapse"
          active-text-color="#ffd04b">
          <!--根据权限不同渲染不同的左侧菜单栏-->
          <el-submenu
            v-for="level1 in menus"
            :key="level1.id"
            :index="''+ level1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ level1.authName }}</span>
            </template>
            <el-menu-item
              v-for="level2 in level1.children"
              :key="level2.id"
              :index="'/' +level2.path">
              <i class="el-icon-menu"></i>{{ level2.authName }}
            </el-menu-item>
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
  // beforeCreate () {
  //   const token = sessionStorage.getItem('token')
  //   if (!token) {
  //     this.$message.warning('请先登录')
  //     this.$router.push('/login')
  //   }
  // },
  created () {
    this.handleLoadMenus()
  },
  name: 'Home',
  data () {
    return {
      isCollapse: false,
      menus: []
    }
  },
  methods: {
    handleLogout () {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async handleLoadMenus () {
      const response = await this.$axios.get('menus')
      this.menus = response.data.data
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
  height: auto;
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
