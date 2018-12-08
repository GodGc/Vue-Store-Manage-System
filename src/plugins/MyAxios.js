// 封装一个axios插件
// 引入axios模块
import axios from 'axios'

const MyAxios = {}
MyAxios.install = function (Vue) {
  // 全局配置axios的baseURL
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // 配置axios的拦截器,给非login路径下的请求添加Authorization请求头
  // Add a request interceptor
  axios.interceptors.request.use(function (config) {
    if (config.url.toLocaleLowerCase() !== 'login') {
      config.headers.Authorization = sessionStorage.getItem('token')
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
  // 把axios写入Vue实例的原型方法中实现继承
  Vue.prototype.$axios = axios
}
// 导出MyAxios对象
export default MyAxios
