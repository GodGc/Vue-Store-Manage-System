// 封装一个axios插件
// 引入axios模块
import axios from 'axios'

const MyAxios = {}
MyAxios.install = function (Vue) {
  // 全局配置axios的baseURL
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 把axios写入Vue实例的原型方法中实现继承
  Vue.prototype.$axios = axios
}
// 导出MyAxios对象
export default MyAxios
