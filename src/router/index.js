import Vue from 'vue'
import Router from 'vue-router'
// 引入路由组件 @ 是src路径
import Login from '@/views/Login'
import Home from '@/views/Home'
import Users from '@/views/users/Users'
import Roles from '@/views/rights/Roles'
import Rights from '@/views/rights/Rights'
import Categories from '@/views/goods/Categories'
// 单独引入message组件
import { Message } from 'element-ui'
// 注册路由组件
Vue.use(Router)

const router = new Router({
  routes: [
    {name: '/', path: '/', redirect: '/home'},
    {name: 'Login', path: '/login', component: Login},
    // 嵌套路由
    {
      name: 'Home',
      path: '/home',
      component: Home,
      children: [
        // 设置默认子路由,要点: 去掉父路由的name属性
        {path: '', component: {template: '<h2>欢迎光临!</h2>'}},
        {name: 'Users', path: '/users', component: Users},
        {name: 'Roles', path: '/roles', component: Roles},
        {name: 'Right', path: '/rights', component: Rights},
        {name: 'Categories', path: '/categories', component: Categories}
      ]
    }
  ]
})

// 使用导航守卫处理每次路由请求前需要做的事(验证token)
router.beforeEach((to, from, next) => {
  // 如果当前请求不是login 验证token
  if (to.name && to.name.toLocaleLowerCase() !== 'login') {
    const token = sessionStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录!')
      return router.push('/login')
    }
  }
  next()
})

export default router
