import Vue from 'vue'
import Router from 'vue-router'
// 引入路由组件 @ 是src路径
import Login from '@/views/Login'
import Home from '@/views/Home'
import Users from '@/views/users/Users'
import Roles from '@/views/rights/Roles'
import Rights from '@/views/rights/Rights'
// 注册路由组件
Vue.use(Router)

export default new Router({
  routes: [
    {name: '/', path: '/', redirect: '/home'},
    {name: 'Login', path: '/login', component: Login},
    // 嵌套路由
    {
      path: '/home',
      component: Home,
      children: [
        // 设置默认子路由,要点: 去掉父路由的name属性
        {path: '', component: {template: '<h2>欢迎光临!</h2>'}},
        {name: 'Users', path: '/users', component: Users},
        {name: 'Roles', path: '/roles', component: Roles},
        {name: 'Right', path: '/rights', component: Rights}
      ]
    }
  ]
})
