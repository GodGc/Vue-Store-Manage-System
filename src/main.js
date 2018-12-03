// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 导入elementUI插件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入基础样式 main.js是根实例 会去渲染index.html中的el管理的标签,所以是全局加载
import '@/assets/css/base.css'

// 引入moment模块
import moment from 'moment'

// 使用ElementUI插件
Vue.use(ElementUI)

// 关闭vue提醒
Vue.config.productionTip = false

// 注册一个全局过滤器,用来处理时间格式
Vue.filter('fmtDate', (value, fmtStr) => {
  return moment(value).format(fmtStr)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
