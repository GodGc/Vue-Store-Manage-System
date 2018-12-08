// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入elementUI插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// main.js会去渲染单文件首页:index.html中的el管理的标签,所以是根实例=>所以是全局加载
// 引入基础样式
import '@/assets/css/base.css'

// 引入moment模块
import moment from 'moment'

// 导入自定义面包屑组件
import Mybreadcrumb from '@/components/Mybreadcrumb'

// 引入myaxios插件 和 注册这个插件
import myaxios from '@/plugins/MyAxios'
Vue.use(myaxios)

// 注册ElementUI插件
Vue.use(ElementUI)

// 关闭vue提醒
Vue.config.productionTip = false

// 注册一个全局过滤器,用来处理时间格式
Vue.filter('fmtDate', (value, fmtStr) => {
  return moment(value).format(fmtStr)
})

// 注册全局面包屑组件
Vue.component(Mybreadcrumb.name, Mybreadcrumb)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
