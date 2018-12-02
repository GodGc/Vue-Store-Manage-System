import Vue from 'vue'
import Router from 'vue-router'
// 引入路由组件 @ 是src路径
import Login from '@/views/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'Login', path: '/login', component: Login
    }
  ]
})
