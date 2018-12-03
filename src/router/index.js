import Vue from 'vue'
import Router from 'vue-router'
// 引入路由组件 @ 是src路径
import Login from '@/views/Login'
import Home from '@/views/Home'
import Users from '@/views/users/Users'
Vue.use(Router)

export default new Router({
  routes: [
    {name: '/', path: '/', redirect: {name: 'Home'}},
    {name: 'Login', path: '/login', component: Login},
    {
      name: 'Home',
      path: '/home',
      component: Home,
      children: [{
        name: 'Users',
        path: '/users',
        component: Users
      }]
    }
  ]
})
